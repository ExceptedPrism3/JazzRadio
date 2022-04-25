const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const prettyMilliseconds = require("pretty-ms");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Display the Bot Uptime."),
    run: async ({ interaction }) => {
      
        let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setDescription(`⏰ Uptime: **${prettyMilliseconds(interaction.client.uptime)}**`)

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