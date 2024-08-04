import { db } from '../../services/database.mjs';

// Update the deleted status of a folder
function updateFolderDeletionStatus(deleted, folderName, userId) {
  const query = 'UPDATE folders SET deleted = ? WHERE folderName = ? AND userId = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [deleted, folderName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve('Folder deletion status updated');
    });
  });
}

export { updateFolderDeletionStatus };
