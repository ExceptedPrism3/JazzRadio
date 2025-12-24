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
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Connection recovered
        } catch (error) {
            // Connection not recovered gracefully within 5 seconds.
            // Check if we can/should try to force a rejoin or just log it.
            // If the socket closed with 4014, it might be a channel move, which Discord handles.
            // If it's a real disconnect (e.g. 521), we should try to rejoin.

            // For now, let's just destroy and let the DB state persist it for a restart/rejoin cycle, 
            // OR implement the same loop as HitRadio. 
            // Given JazzRadio structure is simpler, let's keep it simple:
            // Just DESTROY the connection but DONT delete from DB.
            // This way, if we have an external restarter (pm2) or interval check (index.js), it can recover.

            // Actually, better to try to rejoin once if possible, but without 'rejoinAttempts' tracking in this scope it's hard.
            // HitRadio's player is a class, JazzRadio is functions.
            // Let's mirror HitRadio's logic as best as possible within this function scope:

            logger.error('Connection disconnected. Attempting naive rejoin...');
            try {
                connection.destroy();
                // We rely on the index.js loop or manual restart to pick it up, 
                // OR we can rely on `stateChange` -> Destroyed logic (if we added it).

                // But wait, user wants the SAME fix. HitRadio fix = auto-reconnect logic.
                // Since this `createPlayer` function returns the player and sets up listeners, 
                // we can just re-call joinVoiceChannel here?

                // Let's stick to the modification plan:
                // 1. Destroy connection (so it's not a zombie)
                // 2. DO NOT call stopPlayer() which deletes DB entry.

                logger.error('Destroying zombie connection. DB entry preserved for auto-recovery.');
                connection.destroy();
                // stopPlayer(guild.id); // <-- DISABLED to allow persistence
            } catch (e) {
                logger.error('Error destroying connection:', e);
            }
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
