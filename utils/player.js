const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} = require('@discordjs/voice');
const logger = require('./logger');
const db = require('./database');

const players = new Map();

function getPlayer(guildId) {
    return players.get(guildId);
}

function createPlayer(guild, channelId) {
    const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const streamLink = 'https://jazz-wr05.ice.infomaniak.ch/jazz-wr05-128.mp3';

    const resource = createAudioResource(streamLink);
    player.play(resource);

    // Auto-reconnect logic
    player.on(AudioPlayerStatus.Idle, () => {
        const newResource = createAudioResource(streamLink);
        player.play(newResource);
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Connection recovered
        } catch (error) {
            // Connection not recoverable, destroy it
            stopPlayer(guild.id);
        }
    });

    connection.subscribe(player);
    players.set(guild.id, { connection, player });
    db.addChannel(guild.id, channelId);

    return player;
}

function stopPlayer(guildId) {
    const playerInstance = players.get(guildId);
    if (playerInstance) {
        playerInstance.connection.destroy();
        players.delete(guildId);
        db.removeChannel(guildId);
    }
}

module.exports = {
    getPlayer,
    createPlayer,
    stopPlayer,
};
