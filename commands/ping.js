const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription("Displays the bot's latency."),
    async execute(interaction) {
        const latency = Date.now() - interaction.createdTimestamp;
        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('🏓 Pong')
            .setDescription(`Bot Latency: **${latency}ms**`);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
