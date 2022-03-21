const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
    name: "pause",
    description: "Pause the Radio.",
    category: "global",
    run: async ({ message, client }) => {

        const connection = getVoiceConnection(message.guild.id)

        if (!connection) return message.channel.send("I'm not in a voice channel!")

        connection.setSpeaking(false)

    },
  };
  