const { Client_ID } = require("../config.json")
const { MessageEmbed } = require("discord.js")

module.exports = {
	name: "messageCreate",
	once: false,
    run: async (message) => {
        if (message.mentions.users.has(Client_ID) && !message.author.bot) {
            
            await message.reply('Hi, to view my available commands, execute `/help` of the bot.')

            let embed2 = new MessageEmbed()
            .setColor('ORANGE')
            .setTitle('WARNING')
            .setDescription(`Due to some complications with Discord, a new bot has come in place to replace the current one.
            This bot will be offline by the end of this month! Please make sure to invite the new bot before the deadline!\n\n\nNew Bot: <@968211299043536976>
            \n\nBot Invite Link: https://discord.com/api/oauth2/authorize?client_id=968211299043536976&permissions=277062450240&scope=bot%20applications.commands`)
    
            return await message.reply({embeds: [embed2]})
        }
    }
}