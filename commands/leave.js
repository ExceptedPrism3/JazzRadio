const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Stops the bot and leaves the voice channel'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            const noConnectionEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('I am not in a voice channel!');
            return interaction.reply({ embeds: [noConnectionEmbed], ephemeral: true });
        }

        const botChannelId = connection.joinConfig.channelId;
        const userChannelId = interaction.member.voice.channelId;

        if (!userChannelId) {
            const noChannelEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('You need to be in a voice channel to use this command!');
            return interaction.reply({ embeds: [noChannelEmbed], ephemeral: true });
        }

        if (botChannelId !== userChannelId) {
            const notInSameVCEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription("You're not in the same voice channel as me!");
            return interaction.reply({ embeds: [notInSameVCEmbed], ephemeral: true });
        }

        connection.destroy();
        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Success')
            .setDescription('Left the voice channel! 🚪');
        return interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },
};
