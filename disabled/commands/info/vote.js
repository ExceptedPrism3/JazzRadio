const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: "vote",
    aliases: ['invite', 'inv'],
    description: "Vote for the bot.",
    category: "info",
    run: async ({ message }) => {

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
                .setURL("https://discord.com/api/oauth2/authorize?client_id=955048681025978438&permissions=277028879424&scope=bot%20applications.commands")
                .setLabel("Invite")
                .setStyle("LINK"),
        );

        return message.reply({ embeds: [embed], components: [row] })

    },
};