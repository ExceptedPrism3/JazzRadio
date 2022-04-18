module.exports = {
  name: "ping",
  description: "Display the ping of the Bot.",
  category: "info",
  run: async ({ message, client }) => {
    message.reply("Calculating...").then((resultMsg) => {

      const ping = resultMsg.createdTimestamp - message.createdTimestamp

      resultMsg.edit(`Bot Latency: ${ping}, API Latency: ${client.ws.ping}`)

    })
  },
};
