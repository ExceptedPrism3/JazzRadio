const { Events } = require('discord.js');
const { rotateStatus } = require('../utils/statusRotator');
const { getChannels } = require('../utils/database');
const { createPlayer } = require('../utils/player');
const { startWatchdog } = require('../utils/watchdog');
const logger = require('../utils/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        logger.info(`Logged in as ${client.user.tag}!`);

        // Start rotating the status messages
        rotateStatus(client);

        // Start continuous 24/7 watchdog supervisor
        startWatchdog(client, 30000);

        // Initial staggered auto-rejoin for saved guilds
        const STARTUP_DELAY_MS = 10000;
        const STAGGER_MS = 4000;

        setTimeout(async () => {
            const channels = getChannels();
            let delayMs = 0;

            for (const row of channels) {
                setTimeout(async () => {
                    try {
                        let guild = client.guilds.cache.get(row.guild_id);
                        if (!guild) {
                            try {
                                guild = await client.guilds.fetch(row.guild_id);
                            } catch (fetchErr) {
                                logger.warn(`Startup: Could not fetch guild ${row.guild_id}: ${fetchErr.message}`);
                                return;
                            }
                        }

                        if (!guild) return;

                        const channel = await guild.channels.fetch(row.channel_id).catch(() => null);
                        if (!channel || !channel.isVoiceBased()) {
                            logger.warn(
                                `Startup: Channel ${row.channel_id} in guild ${row.guild_id} not available or not voice. Retaining in DB for watchdog.`,
                            );
                            return;
                        }

                        logger.info(`Startup: Connecting to channel ${channel.name} in guild ${guild.name}`);
                        await createPlayer(guild, channel.id);
                    } catch (error) {
                        logger.error(`Startup: Failed to join channel for guild ${row.guild_id}:`, error);
                    }
                }, delayMs);
                delayMs += STAGGER_MS;
            }
        }, STARTUP_DELAY_MS);
    },
};
