const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Ping command',
  execute: async (interaction) => {
    const ping = Math.round(interaction.client.ws.ping);

    const embed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle('🏓 Pong')
      .setDescription(`Bot ping: **${ping}ms**`);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};