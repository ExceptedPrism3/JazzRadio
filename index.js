require('dotenv').config({ silent: true });
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { rotateStatus } = require('./utils/statusRotator');
const logger = require('./utils/logger');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const { getChannels, removeChannel } = require('./utils/database');
const { createPlayer, stopPlayer } = require('./utils/player');

async function autoRejoinWithRetry(guild, channelId, guildId, attempt = 0) {
    const MAX_ATTEMPTS = 5;
    const BASE_DELAY_MS = 5000;

    try {
        await createPlayer(guild, channelId);
        logger.info(`Auto-rejoin successful for guild ${guildId}`);
    } catch (error) {
        logger.error(`Failed to auto-rejoin channel for guild ${guildId} (attempt ${attempt + 1}):`, error?.message ?? String(error));
        if (attempt < MAX_ATTEMPTS - 1) {
            const delay = BASE_DELAY_MS * Math.pow(2, attempt);
            logger.info(`Retrying auto-rejoin for guild ${guildId} in ${delay / 1000}s...`);
            setTimeout(() => autoRejoinWithRetry(guild, channelId, guildId, attempt + 1), delay);
        } else {
            logger.error(`Giving up auto-rejoin for guild ${guildId} after ${MAX_ATTEMPTS} attempts.`);
        }
    }
}

client.once('ready', async () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    // Start rotating the status messages
    rotateStatus(client);

    // Delay auto-rejoin to avoid Discord rate limiting on rapid restarts.
    // Stagger each guild by 4s to avoid voice connection rate limits.
    setTimeout(async () => {
        const channels = getChannels();
        let delayMs = 0;
        const STAGGER_MS = 4000;
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
                        logger.info(`Removing stale channel for guild ${row.guild_id} (channel missing or not voice)`);
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
    }, 15000); // 15s startup delay before trying to rejoin
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'stop_radio') {
            stopPlayer(interaction.guild.id);
            await interaction.reply({ content: '🛑 Radio stopped and left the channel.', flags: 64 });
            return;
        }
    }

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        logger.error(`Error executing command: ${interaction.commandName}`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: 64 });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: 64 });
        }
    }
});

client.login(process.env.TOKEN).catch((error) => {
    logger.error('Error logging in:', error);
});
