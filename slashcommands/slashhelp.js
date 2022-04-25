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
        .addField('info', 'Display some information about the Bot.\n`/info`', true)
      
        let embed2 = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('WARNING')
        .setDescription(`Due to some complications with Discord, a new bot has come in place to replace the current one.
        This bot will be offline by the end of this month! Please make sure to invite the new bot before the deadline!\n\n\nNew Bot: <@968211299043536976>
        \n\nBot Invite Link: https://discord.com/api/oauth2/authorize?client_id=968211299043536976&permissions=277062450240&scope=bot%20applications.commands`)
        
        await interaction.followUp({embeds: [embed]})
        return await interaction.followUp({embeds: [embed2]})
    },
}