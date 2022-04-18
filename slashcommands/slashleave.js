const { SlashCommandBuilder } = require("@discordjs/builders")
const { getVoiceConnection } = require('@discordjs/voice')

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

        return await interaction.followUp('Disconnected from the voice channel!')
    },
}