const { owners } = require("../../config.json")

module.exports = {
    name: "servers",
    description: "List all servers that contains the bot.",
    category: "admin",
    run: async ({ message, client }) => {

        if (message.author.id != owners) return

        let i = 0;
        
        client.guilds.cache.forEach(guild => {
            message.channel.send(`${guild.name}`)
            i++
        })

        return message.channel.send(`Total Servers: **${i}**`)
    },
};
  