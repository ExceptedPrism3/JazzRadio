const { owners } = require("../../config.json");
module.exports = {
    name: "servers",
    description: "List all servers that contains the bot.",
    category: "admin",
    run: async ({ message, client }) => {

        if (message.author.id != owners) return
        
        let i = 0

        for (i = 0; i < client.guilds.cache.size; i++){

            message.channel.send(`${message.guild.name}`)

        }

        return message.channel.send(`Total Servers: **${i}**`)
        
    },
  };
  