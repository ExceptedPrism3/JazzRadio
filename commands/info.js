const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays information about the bot.'),
    async execute(interaction) {
        const infoEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('Bot Information')
            .setDescription('Here is some information about the bot:')
            .addFields(
                { name: 'Bot Name', value: interaction.client.user.username },
                { name: 'Coded with', value: "JavaScript" },
                { name: 'Created On', value: new Date(interaction.client.user.createdTimestamp).toLocaleDateString() },
                { name: 'Made by', value: "Prism3 and with :heart:" }
            )
            .setFooter({ text: 'Thank you for using our bot!' });

        await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
    },
};
