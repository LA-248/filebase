import { db } from '../../services/database.mjs';

// Update the deleted status of a file
function updateFileDeletionStatus(deleted, fileName, userId) {
  const query = 'UPDATE files SET deleted = ? WHERE fileName = ? AND userId = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [deleted, fileName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve('File deletion status updated');
    });
  });
}

// Update favourite status
function updateFavouritedStatus(table, column, favourited, itemName, userId) {
  const query = `UPDATE ${table} SET isFavourite = ? WHERE ${column} = ? AND userId = ?`;

  return new Promise((resolve, reject) => {
    db.run(query, [favourited, itemName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve();
    });
  })
}

export { updateFileDeletionStatus, updateFavouritedStatus };
