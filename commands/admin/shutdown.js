const { owners } = require("../../config.json");
module.exports = {
    name: "shutdown",
    description: "Shutdown the bot completly.",
    category: "admin",
    run: async ({ message }) => {

        if (message.author.id != owners) return

        try{
            await message.reply("Bot is shutting down...")
            process.exit()
        } catch(e) {
            message.reply(`ERROR: ${e.message}`)
        }
    },
  };
  