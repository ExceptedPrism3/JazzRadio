const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { Bot_Invite} = require("../config.json")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote for the bot."),
    run: async ({ interaction }) => {

        let embed = new MessageEmbed()

        .setColor('ORANGE')
        .setTitle(':heart: Vote for the Bot')
        .setDescription(':arrow_forward: Tog.gg | :arrow_forward: Invite to your Server')

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setURL("https://top.gg/bot/955048681025978438/vote")
                .setLabel("Vote")
                .setStyle("LINK"),
            new MessageButton()
                .setURL(Bot_Invite)
                .setLabel("Invite")
                .setStyle("LINK"),
        );

        let embed2 = new MessageEmbed()
            .setColor('ORANGE')
            .setTitle('WARNING')
            .setDescription(`Due to some complications with Discord, a new bot has come in place to replace the current one.
            This bot will be offline by the end of this month! Please make sure to invite the new bot before the deadline!\n\n\nNew Bot: <@968211299043536976>
            \n\nBot Invite Link: https://discord.com/api/oauth2/authorize?client_id=968211299043536976&permissions=277062450240&scope=bot%20applications.commands`)

        await interaction.followUp({ embeds: [embed], components: [row]})
        return await interaction.followUp({ embeds: [embed2]})
    },
}