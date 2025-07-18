const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const db = new Database(path.join(dataDir, 'jazz.db'));

// Create the table if it doesn't exist
const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS channels (
        guild_id TEXT PRIMARY KEY,
        channel_id TEXT NOT NULL
    )
`);
createTable.run();

function addChannel(guildId, channelId) {
    const stmt = db.prepare('INSERT OR REPLACE INTO channels (guild_id, channel_id) VALUES (?, ?)');
    stmt.run(guildId, channelId);
}

function removeChannel(guildId) {
    const stmt = db.prepare('DELETE FROM channels WHERE guild_id = ?');
    stmt.run(guildId);
}

function getChannels() {
    const stmt = db.prepare('SELECT * FROM channels');
    return stmt.all();
}

module.exports = {
    addChannel,
    removeChannel,
    getChannels,
};
