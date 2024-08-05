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

// Create new uuid for a file/folder and also update shared status
function updateUuidAndSharedStatus(table, column, sharedStatus, uuid, itemName, userId) {
  const query = `UPDATE ${table} SET shared = ?, uuid = ? WHERE ${column} = ? AND userId = ?`;

  return new Promise((resolve, reject) => {
    db.run(query, [sharedStatus, uuid, itemName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve();
    });
  });
}

// When a file is renamed, update it in the database
function updateFileName(newName, userId, fileName) {
  const query = 'UPDATE files SET fileName = ? WHERE userId = ? AND fileName = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [newName, userId, fileName], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve();
    });
  });
}

export {
  updateFileDeletionStatus,
  updateFavouritedStatus,
  updateUuidAndSharedStatus,
  updateFileName,
};
