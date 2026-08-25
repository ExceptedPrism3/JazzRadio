const { Events } = require('discord.js');
const { rotateStatus } = require('../utils/statusRotator');
const { getChannels, removeChannel } = require('../utils/database');
const { createPlayer } = require('../utils/player');
const logger = require('../utils/logger');

async function autoRejoinWithRetry(guild, channelId, guildId, attempt = 0) {
    const MAX_ATTEMPTS = 5;
    const BASE_DELAY_MS = 5000;

    try {
        await createPlayer(guild, channelId);
        logger.info(`Auto-rejoin successful for guild ${guildId}`);
    } catch (error) {
        logger.error(
            `Failed to auto-rejoin channel for guild ${guildId} (attempt ${attempt + 1}):`,
            error?.message ?? String(error),
        );
        if (attempt < MAX_ATTEMPTS - 1) {
            const delay = BASE_DELAY_MS * Math.pow(2, attempt);
            logger.info(`Retrying auto-rejoin for guild ${guildId} in ${delay / 1000}s...`);
            setTimeout(() => autoRejoinWithRetry(guild, channelId, guildId, attempt + 1), delay);
        } else {
            logger.error(`Giving up auto-rejoin for guild ${guildId} after ${MAX_ATTEMPTS} attempts.`);
        }
    }
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        logger.info(`Logged in as ${client.user.tag}!`);

        // Start rotating the status messages
        rotateStatus(client);

        // Delay auto-rejoin to avoid Discord rate limiting on rapid restarts.
        // Stagger each guild by 4s to avoid voice connection rate limits.
        const STARTUP_DELAY_MS = 15000;
        const STAGGER_MS = 4000;

        setTimeout(async () => {
            const channels = getChannels();
            let delayMs = 0;

            for (const row of channels) {
                setTimeout(async () => {
                    try {
                        const guild = await client.guilds.fetch(row.guild_id);
                        if (!guild) {
                            logger.info(`Removing stale guild ${row.guild_id} from DB (bot not in guild)`);
                            removeChannel(row.guild_id);
                            return;
                        }

                        const channel = await guild.channels.fetch(row.channel_id);
                        if (!channel || !channel.isVoiceBased()) {
                            logger.info(
                                `Removing stale channel for guild ${row.guild_id} (channel missing or not voice)`,
                            );
                            removeChannel(row.guild_id);
                            return;
                        }

                        autoRejoinWithRetry(guild, channel.id, row.guild_id);
                    } catch (error) {
                        const isUnknownGuild = error.code === 10004 || (error.body && error.body.code === 10004);
                        if (isUnknownGuild) {
                            logger.info(`Removing stale guild ${row.guild_id} from DB (Unknown Guild)`);
                            removeChannel(row.guild_id);
                        } else {
                            logger.error(`Failed to fetch guild or channel for ${row.guild_id}:`, error);
                        }
                    }
                }, delayMs);
                delayMs += STAGGER_MS;
            }
        }, STARTUP_DELAY_MS);
    },
};
