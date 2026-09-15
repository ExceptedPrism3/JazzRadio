require('dotenv').config({ silent: true });
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('./utils/logger');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Avoid EventEmitter memory leak warnings when handling many voice connections
client.setMaxListeners(100);

// Load Commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        logger.warn(`Command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Load Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Global process error handlers
process.on('unhandledRejection', (reason, _promise) => {
    logger.error('Unhandled Promise Rejection at:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);
});

// Login
client.login(process.env.TOKEN).catch((error) => {
    logger.error('Error logging in:', error);
});
