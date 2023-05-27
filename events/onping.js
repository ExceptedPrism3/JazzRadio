module.exports = {
  name: 'messageCreate',
  execute: async (message) => {
    console.log("1")
    if (message.mentions.has(message.client.user)) {
      const reply = "Hi, to view my available commands, execute `/help`.";
      await message.reply({
        content: reply,
        ephemeral: true,
      });
    }
  },
};
