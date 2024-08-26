const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { voteLink, inviteLink } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Provides a link to vote for the bot.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(':heart: Vote for the Bot')
            .setDescription(':arrow_forward: Tog.gg **|** :arrow_forward: Invite to your Server')
            .setFooter({ text: 'Your support is greatly appreciated!' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Vote')
                    .setStyle(ButtonStyle.Link)
                    .setURL(voteLink)
                    .setEmoji('💖')
            ).addComponents(
                new ButtonBuilder()
                    .setLabel('Invite')
                    .setStyle(ButtonStyle.Link)
                    .setURL(inviteLink)
                    .setEmoji('➕')

            );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    },
};
