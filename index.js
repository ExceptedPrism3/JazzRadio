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

const { getChannels } = require('./utils/database');
const { createPlayer } = require('./utils/player');

client.once('ready', async () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    // Start rotating the status messages
    rotateStatus(client);

    // Auto-rejoin logic
    const channels = getChannels();
    for (const row of channels) {
        try {
            const guild = await client.guilds.fetch(row.guild_id);
            if (!guild) continue;

            const channel = await guild.channels.fetch(row.channel_id);
            if (!channel || !channel.isVoiceBased()) continue;

            createPlayer(guild, channel.id);
        } catch (error) {
            logger.error(`Failed to auto-rejoin channel for guild ${row.guild_id}:`, error);
            // If we can't rejoin, remove the entry to avoid future errors
            require('./utils/database').removeChannel(row.guild_id);
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        logger.error(`Error executing command: ${interaction.commandName}`, error);
        await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
    }
});

client.login(process.env.TOKEN).catch((error) => {
    logger.error('Error logging in:', error);
});
