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
        .setTitle('')
        .setDescription(`⏰ Uptime: **${prettyMilliseconds(interaction.client.uptime)}**`)
        return interaction.followUp({embeds: [embed]})
    },
}