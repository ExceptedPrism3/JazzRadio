const { AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { getChannels } = require('./database');
const { getPlayer, createPlayer, restartStream } = require('./player');
const logger = require('./logger');

// Map of guildId -> { attempts: number, nextAttemptTime: number }
const backoffMap = new Map();

// Prevents overlapping watchdog runs
let isRunning = false;

function getBackoffDelay(attempts) {
    // 5s, 10s, 20s, 40s, max 60s
    return Math.min(60000, 5000 * Math.pow(2, attempts));
}

async function checkGuild(client, guildId, channelId) {
    const now = Date.now();
    const backoff = backoffMap.get(guildId) || { attempts: 0, nextAttemptTime: 0 };

    if (now < backoff.nextAttemptTime) {
        return;
    }

    try {
        let guild = client.guilds.cache.get(guildId);
        if (!guild) {
            try {
                guild = await client.guilds.fetch(guildId);
            } catch (err) {
                // Temporary API failure or bot not in guild; do not delete from DB, back off
                logger.warn(`Watchdog: Could not fetch guild ${guildId}: ${err.message}`);
                backoff.attempts++;
                backoff.nextAttemptTime = now + getBackoffDelay(backoff.attempts);
                backoffMap.set(guildId, backoff);
                return;
            }
        }

        if (!guild) return;

        const playerInstance = getPlayer(guildId);
        const me = guild.members.me || (await guild.members.fetchMe().catch(() => null));
        const currentChannelId = me?.voice?.channelId;

        const isVoiceHealthy =
            playerInstance &&
            playerInstance.connection &&
            playerInstance.connection.state.status === VoiceConnectionStatus.Ready &&
            currentChannelId === channelId;

        if (!isVoiceHealthy) {
            logger.info(
                `Watchdog: Healing voice connection for guild ${guild.name} (${guildId}) in channel ${channelId}`,
            );
            try {
                await createPlayer(guild, channelId);
                logger.info(`Watchdog: Successfully connected guild ${guild.name} (${guildId})`);
                backoffMap.delete(guildId);
            } catch (err) {
                logger.error(`Watchdog: Reconnection failed for guild ${guildId}:`, err);
                backoff.attempts++;
                backoff.nextAttemptTime = now + getBackoffDelay(backoff.attempts);
                backoffMap.set(guildId, backoff);
            }
            return;
        }

        // Voice connection is ready; check if audio player is actively playing
        if (playerInstance && playerInstance.player) {
            const status = playerInstance.player.state.status;
            if (status === AudioPlayerStatus.Idle || status === AudioPlayerStatus.AutoPaused) {
                logger.warn(`Watchdog: Audio player in guild ${guildId} is ${status}. Restarting stream...`);
                restartStream(guildId);
            }
        }

        // Guild is completely healthy, clear any backoff
        backoffMap.delete(guildId);
    } catch (error) {
        logger.error(`Watchdog: Unexpected error checking guild ${guildId}:`, error);
    }
}

async function runWatchdogCycle(client) {
    if (isRunning) return;
    isRunning = true;

    try {
        const channels = getChannels();
        if (!channels || channels.length === 0) {
            isRunning = false;
            return;
        }

        for (const row of channels) {
            await checkGuild(client, row.guild_id, row.channel_id);
            // Small pause between guilds to avoid burst rate limits
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    } catch (error) {
        logger.error('Watchdog cycle encountered error:', error);
    } finally {
        isRunning = false;
    }
}

function startWatchdog(client, intervalMs = 30000) {
    logger.info(`Starting Voice Watchdog supervisor (interval: ${intervalMs / 1000}s)`);

    // Run first cycle after 20 seconds to allow initial startup to settle
    setTimeout(() => {
        runWatchdogCycle(client);
    }, 20000);

    return setInterval(() => {
        runWatchdogCycle(client);
    }, intervalMs);
}

module.exports = {
    startWatchdog,
    runWatchdogCycle,
};
