const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getPlayer, createPlayer } = require('../utils/player');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Plays the radio stream in the voice channel'),
    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const channel = interaction.member.voice.channel;
        if (!channel) {
            const noChannelEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('You need to be in a voice channel to use this command!');
            return interaction.editReply({ embeds: [noChannelEmbed] });
        }

        let player = getPlayer(interaction.guild.id);

        if (player) {
            const messageEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('I am already playing music in a voice channel!');
            return interaction.editReply({ embeds: [messageEmbed] });
        }

        try {
            player = await createPlayer(interaction.guild, channel.id);
        } catch (error) {
            logger.error('Error creating player:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('There was a problem joining the voice channel.');
            return interaction.editReply({ embeds: [errorEmbed] });
        }

        // Don't wait for AudioPlayerStatus.Playing — with inputType 'unknown',
        // ffmpeg probing can take longer than 5s on cold start. The connection
        // being Ready (checked inside createPlayer) is enough to confirm success.
        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Now Playing')
            .setDescription('The Jazz Radio stream is now playing! 🎷');

        const stopButton = new ButtonBuilder()
            .setCustomId('stop_radio')
            .setLabel('Stop Radio')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🛑');

        const row = new ActionRowBuilder().addComponents(stopButton);

        await interaction.editReply({ embeds: [successEmbed], components: [row] });
    },
};
