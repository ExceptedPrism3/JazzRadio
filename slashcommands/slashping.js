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
      
            let embed2 = new MessageEmbed()
            .setColor('ORANGE')
            .setTitle('WARNING')
            .setDescription(`Due to some complications with Discord, a new bot has come in place to replace the current one.
            This bot will be offline by the end of this month! Please make sure to invite the new bot before the deadline!\n\n\nNew Bot: <@968211299043536976>
            \n\nBot Invite Link: https://discord.com/api/oauth2/authorize?client_id=968211299043536976&permissions=277062450240&scope=bot%20applications.commands`)

            resultMsg.edit({embeds: [pingEmbed]})
            return interaction.followUp({embeds: [embed2]})
        })
    },
}