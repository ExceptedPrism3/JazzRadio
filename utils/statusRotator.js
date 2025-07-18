const { ActivityType } = require('discord.js');

function rotateStatus(client) {
    const statusMessages = process.env.STATUS_MESSAGES.split(',');
    const statusInterval = process.env.STATUS_INTERVAL;
    let currentIndex = 0;

    setInterval(() => {
        const status = statusMessages[currentIndex];

        try {
            client.user.setActivity(status, { type: ActivityType.Listening });
        } catch (error) {
            console.error('Error setting activity status:', error);
        }

        currentIndex = (currentIndex + 1) % statusMessages.length;
    }, statusInterval);
}

module.exports = { rotateStatus };
