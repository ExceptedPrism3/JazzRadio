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
const config = require('../config.json');

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
    const streamLink = config.radioUrl;

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
            logger.error('Connection not recoverable, destroying it:', error);
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
