const { SlashCommandBuilder } = require("@discordjs/builders")
const { getVoiceConnection } = require('@discordjs/voice')
const { MessageEmbed } = require("discord.js")

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave your voice channel."),
    run: async ({ interaction }) => {

        if (!interaction.guild.me.voice.channel) return await interaction.followUp("I'm not in a voice channel.")

        if (!interaction.member.voice.channel) return await interaction.followUp("You must be in a voice channel to execute this command")

        if (interaction.member.voice.channel.id != interaction.guild.me.voice.channel.id) return await interaction.followUp('You must be in the same voice channel as the bot to execute this command!')

        const connection = getVoiceConnection(interaction.guild.id)

        if (!connection) return await interaction.followUp("I'm not in a voice channel!")

        connection.destroy()
      
        let embed2 = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('WARNING')
        .setDescription(`Due to some complications with Discord, a new bot has come in place to replace the current one.
        This bot will be offline by the end of this month! Please make sure to invite the new bot before the deadline!\n\n\nNew Bot: <@968211299043536976>
        \n\nBot Invite Link: https://discord.com/api/oauth2/authorize?client_id=968211299043536976&permissions=277062450240&scope=bot%20applications.commands`)

        await interaction.followUp('Disconnected from the voice channel!')
        return await interaction.followUp({embeds: [embed2]})
    },
}