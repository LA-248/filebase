import { db } from '../services/database.mjs';

const User = {
  // INSERT OPERATIONS

  insertNewUser: function (googleId) {
    const query = 'INSERT INTO users (googleId) VALUES (?)';

    return new Promise((resolve, reject) => {
      db.run(query, [googleId], function (err) {
        if (err) {
          reject(`Database error: ${err.message}`);
        }
        // Capture the last inserted ID
        resolve({ id: this.lastID, googleId });
      });
    });
  },

  // READ OPERATIONS

  retrieveUserById: function (id) {
    const query = 'SELECT * FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(`Database error: ${err.message}`);
        }
        resolve(row);
      });
    });
  },

  retrieveUserByGoogleId: function (googleId) {
    const query = 'SELECT * FROM users WHERE googleId = ?';

    return new Promise((resolve, reject) => {
      db.get(query, [googleId], (err, row) => {
        if (err) {
          reject(`Database error: ${err.message}`);
        }
        resolve(row);
      });
    });
  },

  // DELETE OPERATIONS

  deleteUserById: function (userId) {
    const query = 'DELETE FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [userId], (err) => {
        if (err) {
          reject(`Database error: ${err.message}`);
        }
        resolve('User deleted successfully');
      });
    });
  },
};

export { User };
