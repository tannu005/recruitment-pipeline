### `database.js`
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const logger = require('./logger');

const dbDir = process.env.PERSISTENT_DIR || (process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, '../data'));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'recruitment.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error(`Could not connect to database: ${err.message}`);
  } else {
    logger.info('Connected to SQLite database.');
  }
});

// Wrap DB commands in promises for cleaner async/await usage
const dbQuery = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

const initializeDatabase = async () => {
  try {
    // Enable foreign keys for data integrity
    await dbQuery.run('PRAGMA foreign_keys = ON;');

    // 1. Create Users Table (for recruiter authentication)
    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'recruiter',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // No default seed user - full production mode

    // 2. Create Jobs Table
    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        i

// ... (truncated for workspace view)
```