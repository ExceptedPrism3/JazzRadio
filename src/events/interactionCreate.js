const { Events } = require('discord.js');
const { stopPlayer } = require('../utils/player');
const logger = require('../utils/logger');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle Button Interactions
        if (interaction.isButton()) {
            if (interaction.customId === 'stop_radio') {
                stopPlayer(interaction.guild.id);
                await interaction.reply({ content: '🛑 Radio stopped and left the channel.', flags: 64 });
                return;
            }
        }

        // Handle Slash Commands
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

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
    },
};
