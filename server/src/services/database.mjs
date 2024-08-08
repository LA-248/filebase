import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('db/database.db', (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Database connected.');
  }
});

const setupDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, googleId TEXT)', (err) => {
        if (err) {
          reject(err);
        }
      });
      db.run('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, userId INTEGER, rootFolder TEXT, folderName TEXT, fileName TEXT, fileSize INTEGER, fileExtension TEXT, isFavourite TEXT, shared TEXT, deleted TEXT, uuid VARCHAR, FOREIGN KEY(userId) REFERENCES users(id))', (err) => {
        if (err) {
          reject(err);
        }
      });
      db.run('CREATE TABLE IF NOT EXISTS folders (id INTEGER PRIMARY KEY, userId INTEGER, rootFolder TEXT, folderName TEXT, isFavourite TEXT, shared TEXT, deleted TEXT, parentFolder TEXT, uuid VARCHAR, FOREIGN KEY(userId) REFERENCES users(id))', (err) => {
        if (err) {
          reject(err);
        }
      });
      resolve();
    });
  });
};

export { db, setupDatabase };
