const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const errorLogStream = fs.createWriteStream(path.join(logDirectory, 'error.log'), { flags: 'a' });

module.exports = {
    info: (message) => {
        console.log(`[INFO] ${message}`);
    },
    warn: (message) => {
        console.warn(`[WARN] ${message}`);
    },
    error: (message, error) => {
        const errorMessage = `[ERROR] ${message}\n${error ? error.stack : ''}\n`;
        console.error(errorMessage);
        errorLogStream.write(errorMessage);
    }
};
