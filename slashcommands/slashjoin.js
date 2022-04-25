const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice')

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join your voice channel."),
    run: async ({ interaction }) => {

        if (interaction.guild.me.voice.channel && interaction.member.voice.channel) return await interaction.followUp("I'm already in a voice channnel.")

        if (!interaction.member.voice.channel) return await interaction.followUp('You need to be in a voice channel to execute this command.')

        if (!interaction.member.voice.channel.joinable) return await interaction.followUp('I need permission to join your voice channel!')

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        })

        const player = createAudioPlayer();
        const resource = createAudioResource(process.env.STREAM)

        player.play(resource)
		connection.subscribe(player)

        return await interaction.followUp(`I have joined ${interaction.member.voice.channel} channel.`)
    },
}