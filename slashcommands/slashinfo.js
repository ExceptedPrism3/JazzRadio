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
        
        let embeds = await interaction.followUp({embeds: [embed], components: [row]})
        return await embeds.react(jazzRadioEmoji)
    },
}