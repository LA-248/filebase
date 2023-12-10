import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('../db/database.db', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connected.');
  }
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, googleId TEXT, displayName TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS files (userId INTEGER, fileName TEXT, fileSize INTEGER, fileData BLOB, FOREIGN KEY(userId) REFERENCES users(id))');
});

export { db };
