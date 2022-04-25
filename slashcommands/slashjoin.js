const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice')
const { MessageEmbed } = require("discord.js")

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
      
        let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('WARNING')
        .setDescription(`Due to some complications with Discord, a new bot has come in place to replace the current one.
        This bot will be offline by the end of this month! Please make sure to invite the new bot before the deadline!\n\n\nNew Bot: <@968211299043536976>
        \n\nBot Invite Link: https://discord.com/api/oauth2/authorize?client_id=968211299043536976&permissions=277062450240&scope=bot%20applications.commands`)

        await interaction.followUp(`I have joined ${interaction.member.voice.channel} channel.`)
        return await interaction.followUp({embeds: [embed]})
    },
}