const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const fs = require("fs")
const { clientId } = require("../config.json")
const LOAD_SLASH = process.argv[2] == "load"

module.exports = {
  name: "ready",
  run: async (client) => {
    console.log(`Logged in as ${client.user.tag}`)
    console.log("====================================")

    const activities_list = [
      { type: "PLAYING", message: "Saxophone" }, // This is duplicated due to the Math Library and how it's implemented
      { type: "PLAYING", message: "Saxophone" },
      { type: "WATCHING", message: "a Jazz Concert" },
      { type: "LISTENING", message: "Contemporary Jazz" },
      { type: "LISTENING", message: "DJ Hmida" },
    ];

    setInterval(() => {
      const index = Math.floor(
        Math.random() * (activities_list.length - 1) + 1
      );

      client.user.setActivity(activities_list[index].message, {
        type: activities_list[index].type,
      });
    }, 1000 * 60 * 5); // Cycle every 5 minutes

    client.slashcommands = new Discord.Collection()

    let commands = []

    const slashFiles = fs
      .readdirSync("./slashcommands")
      .filter((file) => file.endsWith(".js"))

    for (const file of slashFiles) {
      const slashcmd = require(`../slashcommands/${file}`)
      client.slashcommands.set(slashcmd.data.name, slashcmd)

      if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
    }

    if (LOAD_SLASH) {
      const rest = new REST({ version: "10" }).setToken(process.env.TOKEN)
      console.log("Slash Commands Deployed")
      rest
        .put(Routes.applicationCommands(clientId), { body: commands })
        .then(() => {
          console.log("SlashCommands have been loaded successfully!")
          process.exit(0)
        })
        .catch((err) => {
          if (err) {
            console.log(err)
            process.exit(1)
          }
        });
    } else {
      client.on("interactionCreate", (interaction) => {

        async function handleCommand() {

          if (!interaction.isCommand()) return

          const slashcmd = client.slashcommands.get(interaction.commandName)

          if (!slashcmd) interaction.reply("Not a valid slash command")

          await interaction.deferReply()
          await slashcmd.run({ client, interaction })
        }
        handleCommand()
      });
    }
  },
};
