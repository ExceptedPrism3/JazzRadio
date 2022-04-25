const { Client_ID } = require("../config.json")

module.exports = {
	name: "messageCreate",
	once: false,
    run: async (message) => {
        if (message.mentions.users.has(Client_ID) && !message.author.bot) {
            
            return await message.reply('Hi, to view my available commands, execute `/help` of the bot.')
        }
    }
}