const { ActivityType } = require('discord.js');

const config = require('../config.json');

function rotateStatus(client) {
    const statusMessages = config.statusMessages;
    const statusInterval = config.statusInterval;
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
