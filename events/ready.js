const Discord = require("discord.js")
const fs = require("fs")

module.exports = {
  name: "ready",
  run: async (client) => {
    console.log(`Logged in as ${client.user.tag}`)
    console.log('====================================')

    const activities_list = [
      { type: 'PLAYING',  message: 'Saxophone' }, // This is duplicated due to the Math Library and how it's implemented
      { type: 'PLAYING',  message: 'Saxophone' },
      { type: 'WATCHING', message: 'a Jazz Concert' },
      { type: 'LISTENING', message: 'Contemporary Jazz' },
      { type: 'LISTENING', message: 'DJ Hmida' }
    ];
    
    setInterval(() => {

      const index = Math.floor(Math.random() * (activities_list.length - 1) + 1)
  
      client.user.setActivity(activities_list[index].message, { type: activities_list[index].type })

    }, 1000 * 60 * 5); // Cycle every 5 minutes

    client.slashcommands = new Discord.Collection()

    const slashFiles = fs.readdirSync("./slashcommands/").filter(file => file.endsWith(".js"))

    for (const file of slashFiles) {
      const slashcmd = require(`../slashcommands/${file}`)
      client.slashcommands.set(slashcmd.data.name, slashcmd)
    }

    client.on("interactionCreate", (interaction) => {

      async function handleCommand() {

        if (!interaction.isCommand()) return
  
        const slashcmd = client.slashcommands.get(interaction.commandName)
        
        if (!slashcmd) interaction.reply("Not a valid slash command")
  
        await interaction.deferReply()
        await slashcmd.run({ client, interaction })
  
      }
      handleCommand()
    })
  },
};