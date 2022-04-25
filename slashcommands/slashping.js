const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Display the ping of the Bot."),
    run: async ({ interaction }) => {

        let calculating = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('Ping')
        .setDescription('**Calculating...**')
        
        await interaction.followUp({embeds: [calculating]}).then((resultMsg) => {

            const ping = resultMsg.createdTimestamp - interaction.createdTimestamp

            let pingEmbed = new MessageEmbed()
            .setColor('ORANGE')
            .setTitle('🏓 Pong')
            .setDescription(`Bot Latency: **${ping}**\n\nAPI Latency: **${interaction.client.ws.ping}**`)

            return resultMsg.edit({embeds: [pingEmbed]})
        })
    },
}