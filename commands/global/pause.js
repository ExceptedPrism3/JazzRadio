module.exports = {
    name: "pause",
    description: "Pause the Radio.",
    category: "global",
    run: async ({ message }) => {

        const serverQueue = message.guild.id

            serverQueue.connection.dispatcher.pause()
            message.reply("Done")
        
    },
  };
  