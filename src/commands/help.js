const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Displays all available commands.'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('Help Menu')
            .setDescription('Here are all the available commands:')
            .addFields(
                { name: '🎷 **/play**', value: 'Play the Jazz radio stream in your voice channel' },
                { name: '🛑 **/stop**', value: 'Stop the stream and leave the voice channel' },
                { name: '🏓 **/ping**', value: 'Display bot latency' },
                { name: '⏰ **/uptime**', value: 'Display bot uptime' },
                { name: '📊 **/vote**', value: 'Get a link to vote for the bot and invite it' },
                { name: 'ℹ️ **/info**', value: 'Display information about the bot' },
                { name: '❓ **/help**', value: 'Display this help menu' },
            )
            .setFooter({ text: 'Use /<command> to run any command.' });

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
