const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Display the ping of the Bot."),
    run: async ({ interaction }) => {
        
        await interaction.followUp("Calculating...").then((resultMsg) => {

            const ping = resultMsg.createdTimestamp - interaction.createdTimestamp

            resultMsg.edit(`Bot Latency: ${ping}, API Latency: ${interaction.client.ws.ping}`)
        })
    },
}