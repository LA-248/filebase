import { db } from '../services/database.mjs';

const retrieveFileSizes = async (userId) => {
  const query = 'SELECT f.fileSize FROM files AS f WHERE f.userId = ?';

  return new Promise((resolve, reject) => {
    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error('Database error:', err.message);
        reject('Database error.');
      }

      // Sum the fileSize from each row - this gives us the total amount of storage the user has used
      const totalUsedStorage = rows.reduce((acc, row) => acc + row.fileSize, 0);
      resolve(totalUsedStorage.toFixed(2));
    });
  });
};

export { retrieveFileSizes };
