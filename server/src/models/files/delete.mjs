import { db } from '../../services/database.mjs';

// Permanently delete a file
function permanentlyDeleteFileFromDatabase(fileName, userId) {
  const query = 'DELETE FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [fileName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve('File permanently deleted');
    });
  });
}

// Delete the uuid for a file or folder
function deleteUuidFromDatabase(table, column, sharedStatus, uuid, itemName, userId) {
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

export { permanentlyDeleteFileFromDatabase, deleteUuidFromDatabase };
