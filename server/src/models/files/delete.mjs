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

export { permanentlyDeleteFileFromDatabase };
