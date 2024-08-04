import { db } from '../services/database.mjs';

// Check if the name of a file or folder already exists in the database, if it does, modify it
const handleDuplicateNames = async (uploadedName, table, column, userId) => {
  const query = `SELECT f.${column} FROM ${table} AS f WHERE f.${column} = ? AND f.userId = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [uploadedName, userId], (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        reject('Database error.');
        // File name already exists, modify the filename
      } else if (row) {
        const timestamp = `-${Date.now()}`;

        if (table === 'files') {
          let nameCopy = uploadedName.replace(/(\.[^\.]+)$/, `${timestamp}$1`);
          resolve(nameCopy);
        } else {
          // If table being queried is not 'files' (which means it is a folder), append timestamp directly to the end of the name, without looking for a file extension
          let nameCopy = `${uploadedName}${timestamp}`;
          resolve(nameCopy);
        }
      } else {
        // No duplicate found, use the original filename
        resolve(uploadedName);
      }
    });
  });
};

export { handleDuplicateNames };
