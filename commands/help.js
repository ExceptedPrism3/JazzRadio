const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Displays all available commands.'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('Help Menu')
            .setDescription('Here are all the available commands:')
            .addFields(
                { name: '🎵 **/play** | **/join** | **/radio**', value: 'Play audio in a voice channel' },
                { name: '⏹️ **/stop** | **/leave**', value: 'Stop the audio and leave the voice channel' },
                { name: '🏓 **/ping**', value: 'Display bot latency' },
                { name: '⏲️ **/uptime**', value: 'Display bot uptime' },
                { name: '📊 **/vote**', value: 'Get a link to vote for the bot' },
                { name: 'ℹ️ **/info**', value: 'Display information about the bot' },
            )
            .setFooter({ text: 'Use /command for more details on each command.' });

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
