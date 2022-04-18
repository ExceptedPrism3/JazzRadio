const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    description: "Display all available commands.",
    category: "info",
    run: async ({ message }) => {
      
        let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('Help Commands')
        .addField('Join', 'Join your voice channel and play Jazz.\n`jz!join`', true)
        .addField('Ping', 'Display the Bot Latency.\n`jz!ping`', true)
        .addField('Leave', 'Leave your voice channel.\n`jz!leave`', true)
        .addField('Vote', 'Display the links of the bot.\n`jz!vote`', true)
        .addField('uptime', 'Display the Bot Uptime.\n`jz!uptime`', true)
        return message.reply({embeds: [embed]})

    },
};
  