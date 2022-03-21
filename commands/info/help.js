const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "Display all available commands.",
    category: "info",
    run: async ({ message }) => {
      
        let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('Help Commands')
        .addField('Join', 'Join your voice channel and play Jazz.\n`jz!join`', true)
        .addField('Resume', 'Resume playing the radio.\n`jz!resume`', true)
        .addField('Ping', 'Display the Bot Latency.\n`jz!ping`', true)
        .addField('Leave', 'Leave your voice channel.\n`jz!leave`', true)
        .addField('Pause', 'Pause playing the radio.\n`jz!pause`', true)
        .addField('Vote', 'Display the links of the bot.\n`jz!vote`', true)
        return message.channel.send({embeds: [embed]})

    },
  };
  