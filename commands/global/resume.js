module.exports = {
    name: "resume",
    description: "Reumse the Radio.",
    category: "global",
    run: async ({ message, client }) => {
      message.reply("Calculating...").then((resultMsg) => {
  
        const ping = resultMsg.createdTimestamp - message.createdTimestamp
  
        resultMsg.edit(`Bot Latency: ${ping}, API Latency: ${client.ws.ping}`)
  
      })
    },
  };
  