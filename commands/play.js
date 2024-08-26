const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, entersState, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays the radio stream in the voice channel'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) {
            const noChannelEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('You need to be in a voice channel to use this command!');
            return interaction.reply({ embeds: [noChannelEmbed], ephemeral: true });
        }

        const existingConnection = getVoiceConnection(interaction.guild.id);
        const streamLink = "https://jazz-wr05.ice.infomaniak.ch/jazz-wr05-128.mp3";

        if (existingConnection) {
            const channelId = existingConnection.joinConfig.channelId;
            const messageEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error');

            if (channelId === channel.id) {
                messageEmbed.setDescription('I am already playing music in this voice channel!');
            } else {
                messageEmbed.setDescription('I am already playing music in another voice channel!');
            }

            return interaction.reply({ embeds: [messageEmbed], ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(streamLink);

        connection.subscribe(player);

        try {
            player.play(resource);
            await entersState(player, AudioPlayerStatus.Playing, 5e3);

            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Success')
                .setDescription('The audio is now playing! 🔊');

            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            console.error('Error while trying to play audio:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚫 Error')
                .setDescription('There was an error trying to play the audio.');

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        player.on(AudioPlayerStatus.Idle, () => {
            const newResource = createAudioResource(streamLink);
            player.play(newResource);
        });
    },
};
