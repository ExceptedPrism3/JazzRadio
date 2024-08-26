const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const { rotateStatus } = require('./utils/statusRotator');
const logger = require('./utils/logger');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    // Start rotating the status messages
    rotateStatus(client);
});

client.on('interactionCreate', async interaction => {
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

client.login(token).catch(error => {
    logger.error('Error logging in:', error);
});
