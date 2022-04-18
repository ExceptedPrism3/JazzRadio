const { getVoiceConnection } = require('@discordjs/voice')

module.exports = {
    name: "leave",
    aliases: ['stop', '9wd', 'quit'],
    description: "Leave your voice channel.",
    category: "global",
    run: async ({ message }) => {

        if (!message.guild.me.voice.channel) return message.reply("I'm not in a voice channel.")

        if (!message.member.voice.channel) return message.reply("You must be in a voice channel to execute this command")

        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.reply("You must be in the same voice channel as the bot to execute this command!")

        const connection = getVoiceConnection(message.guild.id)

        if (!connection) return message.reply("I'm not in a voice channel!")

        connection.destroy()

        return message.reply('Disconnected from the voice channel!')
    },
};
  