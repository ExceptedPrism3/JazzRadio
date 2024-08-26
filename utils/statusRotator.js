const { ActivityType } = require('discord.js');
const { statusMessages, statusInterval } = require('../config.json');

function rotateStatus(client) {
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
