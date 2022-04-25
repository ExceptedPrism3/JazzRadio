const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { Owners, Emoji, Bot_Invite, Support_Link } = require("../config.json")

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Display some information about the Bot."),
    run: async ({ client, interaction }) => {

        const jazzRadioEmoji = client.emojis.cache.get(Emoji);
      
        let embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('Bot Information')
        .setDescription(`Name: **JazzRadio**.\n\n
        Description: **Pure Classic Jazz music to your ears**.\n\n
        Coded with: **JavaScript**.\n\n
        Host: **EU/France**.\n\n\n
        Made with ❤️ by ${Owners}.`)

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setURL(Bot_Invite)
                .setLabel("➕ Invite")
                .setStyle("LINK"),
            new MessageButton()
                .setURL(Support_Link)
                .setLabel("📩 Support")
                .setStyle("LINK"),
        );
      
        let embed2 = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('WARNING')
        .setDescription(`Due to some complications with Discord, a new bot has come in place to replace the current one.
        This bot will be offline by the end of this month! Please make sure to invite the new bot before the deadline!\n\n\nNew Bot: <@968211299043536976>
        \n\nBot Invite Link: https://discord.com/api/oauth2/authorize?client_id=968211299043536976&permissions=277062450240&scope=bot%20applications.commands`)
        
        let embeds = await interaction.followUp({embeds: [embed], components: [row]})
        await embeds.react(jazzRadioEmoji)
        return await interaction.followUp({embeds: [embed2]})
    },
}