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
  db.run('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, userId INTEGER, folderName TEXT, fileName TEXT, fileSize INTEGER, fileExtension TEXT, isFavourite TEXT, shared TEXT, deleted TEXT, uuid VARCHAR, FOREIGN KEY(userId) REFERENCES users(id))');
  db.run('CREATE TABLE IF NOT EXISTS folders (id INTEGER PRIMARY KEY, userId INTEGER, folderName TEXT, isFavourite TEXT, shared TEXT, deleted TEXT, parentFolder TEXT, uuid VARCHAR, FOREIGN KEY(userId) REFERENCES users(id))');
});

export { db };
