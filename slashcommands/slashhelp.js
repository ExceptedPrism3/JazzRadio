const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Display all available commands."),
    run: async ({ interaction }) => {
      
        let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('Help Commands')
        .addField('Join', 'Join your voice channel and play Jazz.\n`/join`', true)
        .addField('Ping', 'Display the Bot Latency.\n`/ping`', true)
        .addField('Leave', 'Leave your voice channel.\n`/leave`', true)
        .addField('Vote', 'Display the links of the bot.\n`/vote`', true)
        .addField('uptime', 'Display the Bot Uptime.\n`/uptime`', true)
        return interaction.followUp({embeds: [embed]})
    },
}