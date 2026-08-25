const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('uptime').setDescription("Displays the bot's uptime."),
    async execute(interaction) {
        const totalSeconds = interaction.client.uptime / 1000;
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const embed = new EmbedBuilder().setColor('Orange').setTitle('⏰ Uptime:').setDescription(`${uptime}`);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
