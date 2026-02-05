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
        // Wait a bit before trying to play again to avoid spamming if the stream is dead
        setTimeout(() => {
            try {
                const newResource = createAudioResource(streamLink);
                player.play(newResource);
            } catch (error) {
                logger.error('Failed to restart stream:', error);
                // If resource creation fails, maybe try again later or destroy?
                // For now, reliance on PM2 or manual restart if stream is permanently dead.
            }
        }, 3000);
    });

    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 20_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 20_000),
            ]);
            // Connection recovered
        } catch (error) {
            logger.error('Connection not recoverable, destroying it:', error);
            try {
                if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
            } catch (err) {
                logger.error('Failed to destroy connection:', err);
            }

            // CRITICAL FIX: Remove from memory map so /play works again
            players.delete(guild.id);

            // Note: We intentionally do NOT remove from DB (db.removeChannel), 
            // so that the bot "remembers" it should be here if it restarts.
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
        db.removeChannel(guildId); // This removes from DB. Only call this on /stop command!
    }
}

module.exports = {
    getPlayer,
    createPlayer,
    stopPlayer,
};
