const fs = require('fs');
const path = require('path');

// Define the directory and file path
const logDirectory = path.join(__dirname, '../logs');
const logFilePath = path.join(logDirectory, 'error.log');

// Ensure the logs directory exists, if not, create it
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Function to log messages to the log file
function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage);
}

module.exports = {
    info: (message) => logToFile(`[INFO] ${message}`),
    error: (message) => logToFile(`[ERROR] ${message}`),
    warn: (message) => logToFile(`[WARN] ${message}`),
};
