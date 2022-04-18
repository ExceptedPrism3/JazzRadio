const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("servers")
        .setDescription("Admin Command."),
        devOnly: true,
    run: async ({ interaction, client }) => {

        let i = 0;
        const servers = []
        
        client.guilds.cache.forEach(guild => {
            servers.push(`\`[\` **${guild.name}** \`]\``)
            i++
        })

        return await interaction.followUp(`**Server Names:** ${servers}\nTotal Servers: **${i}**`)
    },
}