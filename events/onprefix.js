const { Prefix, Bot_Invite } = require("../config.json")
const { MessageEmbed } = require("discord.js")

module.exports = {
	name: "messageCreate",
	once: false,
    run: async (message) => {
    if (message.content.startsWith(Prefix)) {
        await message.reply("❗ All commands have been replaced with **__Slash Commands__** ❗\n\n" +
        "To view all available commands, execute `/help` command of the bot.\n\n" +
        "If you can't see **JazzRadio** commands list, try **re-inviting** the bot via the link bellow:\n" +
        "**" + Bot_Invite + "**")

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