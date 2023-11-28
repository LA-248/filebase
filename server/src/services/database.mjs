import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('../db/database.db', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connected.');
  }
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, googleId TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, userId TEXT, filePath TEXT)");
});

export { db };