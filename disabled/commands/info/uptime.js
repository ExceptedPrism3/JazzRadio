const { MessageEmbed } = require("discord.js")
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "uptime",
    description: "Display the Bot Uptime.",
    category: "info",
    run: async ({ message, client }) => {
      
        let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('')
        .setDescription(`⏰ Uptime: **${prettyMilliseconds(client.uptime)}**`)
        return message.reply({embeds: [embed]})
    },
};
  