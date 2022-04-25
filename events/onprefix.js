const { Prefix, Bot_Invite } = require("../config.json")

module.exports = {
	name: "messageCreate",
	once: false,
    run: async (message) => {
    if (message.content.startsWith(Prefix)) {
        await message.reply("❗ All commands have been replaced with **__Slash Commands__** ❗\n\n" +
        "To view all available commands, execute `/help` command of the bot.\n\n" +
        "If you can't see **JazzRadio** commands list, try **re-inviting** the bot via the link bellow:\n" +
        "**" + Bot_Invite + "**")
        }
    }
}