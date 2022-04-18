const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("shutdown")
        .setDescription("Admin Command."),
        devOnly: true,
    run: async ({ interaction }) => {

        try{
            await interaction.followUp("Bot is shutting down...")
            process.exit(0)
        } catch(e) {
            interaction.followUp(`ERROR: ${e.message}`)
        }
    },
}