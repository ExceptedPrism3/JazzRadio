const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    NoSubscriberBehavior,
    StreamType,
} = require('@discordjs/voice');
const logger = require('./logger');
const db = require('./database');
const config = require('../../config.json');

const players = new Map();

function getPlayer(guildId) {
    return players.get(guildId);
}

function isPlayerActive(guildId) {
    const playerInstance = players.get(guildId);
    if (!playerInstance || !playerInstance.connection) return false;
    return playerInstance.connection.state.status !== VoiceConnectionStatus.Destroyed;
}

function isPlayerPlaying(guildId) {
    const playerInstance = players.get(guildId);
    if (!playerInstance || !playerInstance.player) return false;
    return playerInstance.player.state.status === AudioPlayerStatus.Playing;
}

function clearStalePlayer(guildId) {
    const playerInstance = players.get(guildId);
    if (!playerInstance || !playerInstance.connection) return;
    if (playerInstance.connection.state.status === VoiceConnectionStatus.Destroyed) {
        players.delete(guildId);
    }
}

function waitForReady(connection, timeoutMs = 45e3) {
    return new Promise((resolve, reject) => {
        if (connection.state.status === VoiceConnectionStatus.Ready) {
            resolve();
            return;
        }
        const timeout = setTimeout(() => {
            connection.removeListener(VoiceConnectionStatus.Ready, onReady);
            connection.removeListener(VoiceConnectionStatus.Destroyed, onDestroyed);
            reject(new Error('Voice connection timed out'));
        }, timeoutMs);
        const onReady = () => {
            clearTimeout(timeout);
            connection.removeListener(VoiceConnectionStatus.Destroyed, onDestroyed);
            resolve();
        };
        const onDestroyed = () => {
            clearTimeout(timeout);
            connection.removeListener(VoiceConnectionStatus.Ready, onReady);
            reject(new Error('Connection destroyed before ready'));
        };
        connection.once(VoiceConnectionStatus.Ready, onReady);
        connection.once(VoiceConnectionStatus.Destroyed, onDestroyed);
    });
}

function restartStream(guildId) {
    const playerInstance = players.get(guildId);
    if (!playerInstance || !playerInstance.player) return false;

    try {
        const streamLink = config.radioUrl;
        const resource = createAudioResource(streamLink, {
            inputType: StreamType.Arbitrary,
            inlineVolume: false,
        });
        playerInstance.player.play(resource);
        return true;
    } catch (error) {
        logger.error(`Failed to restart stream for guild ${guildId}:`, error);
        return false;
    }
}

async function createPlayer(guild, channelId) {
    // If an existing healthy connection is already in this channel, return it
    const existing = players.get(guild.id);
    if (
        existing &&
        existing.connection &&
        existing.connection.state.status === VoiceConnectionStatus.Ready &&
        existing.connection.joinConfig.channelId === channelId
    ) {
        // Ensure stream is playing
        if (existing.player.state.status === AudioPlayerStatus.Idle) {
            restartStream(guild.id);
        }
        return existing.player;
    }

    // Clean up any stale/broken connection first
    if (existing && existing.connection) {
        try {
            if (existing.connection.state.status !== VoiceConnectionStatus.Destroyed) {
                existing.connection.destroy();
            }
        } catch {
            // ignore
        }
        players.delete(guild.id);
    }

    const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });

    try {
        await waitForReady(connection, 45e3);
        logger.info(`Connection to voice channel ${channelId} in guild ${guild.id} is ready.`);
    } catch (error) {
        logger.error(`Failed to connect to voice channel in guild ${guild.id}:`, error);
        try {
            if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy();
            }
        } catch {
            // ignore
        }
        players.delete(guild.id);
        throw error;
    }

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });

    const streamLink = config.radioUrl;
    const resource = createAudioResource(streamLink, {
        inputType: StreamType.Arbitrary,
        inlineVolume: false,
    });
    player.play(resource);

    // Log and recover from stream errors
    player.on('error', (error) => {
        logger.error(`AudioPlayer error in guild ${guild.id}, attempting stream recovery:`, error.message);
        setTimeout(() => {
            restartStream(guild.id);
        }, 3000);
    });

    // Auto-reconnect stream when idle
    player.on(AudioPlayerStatus.Idle, () => {
        setTimeout(() => {
            const current = players.get(guild.id);
            if (current && current.player === player) {
                restartStream(guild.id);
            }
        }, 3000);
    });

    // Voice connection disconnect handling
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 15_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 15_000),
            ]);
            // Recovered
        } catch {
            logger.warn(`Voice connection severed for guild ${guild.id}. Cleaning up for Watchdog healing...`);
            try {
                if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
            } catch (err) {
                logger.error('Failed to destroy severed connection:', err);
            }
            players.delete(guild.id);
        }
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
        players.delete(guild.id);
    });

    connection.subscribe(player);
    players.set(guild.id, { connection, player });
    db.addChannel(guild.id, channelId);

    return player;
}

function stopPlayer(guildId) {
    const playerInstance = players.get(guildId);
    if (playerInstance) {
        try {
            if (playerInstance.connection.state.status !== VoiceConnectionStatus.Destroyed) {
                playerInstance.connection.destroy();
            }
        } catch {
            // ignore
        }
        players.delete(guildId);
        db.removeChannel(guildId); // Only remove from DB when user explicitly requests stop
    }
}

module.exports = {
    getPlayer,
    isPlayerActive,
    isPlayerPlaying,
    clearStalePlayer,
    restartStream,
    createPlayer,
    stopPlayer,
};
