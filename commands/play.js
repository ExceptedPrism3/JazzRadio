const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPlayer, createPlayer } = require('../utils/player');
const { entersState, AudioPlayerStatus } = require('@discordjs/voice');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Plays the radio stream in the voice channel'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) {
            const noChannelEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('You need to be in a voice channel to use this command!');
            return interaction.reply({ embeds: [noChannelEmbed], ephemeral: true });
        }

        let player = getPlayer(interaction.guild.id);

        if (player) {
            const messageEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('I am already playing music in a voice channel!');
            return interaction.reply({ embeds: [messageEmbed], ephemeral: true });
        }

        player = createPlayer(interaction.guild, channel.id);

        try {
            await entersState(player, AudioPlayerStatus.Playing, 5e3);
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Success')
                .setDescription('The audio is now playing! 🔊');
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            logger.error('Error while trying to play audio:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('There was an error trying to play the audio.');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
