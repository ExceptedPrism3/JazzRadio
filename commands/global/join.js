const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
module.exports = {
    name: "join",
    aliases: ['play', 'p'],
    description: "Join your voice channel.",
    category: "global",
    run: async ({ message }) => {

        if (message.guild.me.voice.channel && message.member.voice.channel.id) return message.reply("I'm already in a voice channnel.")

        if (!message.member.voice.channel) return message.reply('You need to be in a voice channel to execute this command.')

        if (!message.member.voice.channel.joinable) return message.reply('I need permission to join your voice channel!')

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })

        const player = createAudioPlayer();
        const resource = createAudioResource(process.env.STREAM);

        player.play(resource);
		connection.subscribe(player);

        return message.reply(`I have joined ${message.member.voice.channel} channel.`)
    },
  };
  