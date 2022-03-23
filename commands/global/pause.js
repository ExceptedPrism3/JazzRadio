const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
module.exports = {
    name: "pause",
    description: "Pause the Radio.",
    category: "global",
    run: async ({ message }) => {

        const player = createAudioPlayer();

        player.stop()
            message.reply("Done")
        
    },
  };
  