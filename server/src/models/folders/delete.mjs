import { db } from '../../services/database.mjs';

// Delete all content that exists within a certain folder
function deleteFolderContents(folderName, userId) {
  const query = 'DELETE FROM files AS f WHERE f.folderName = ? AND f.userId = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [folderName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve('Folder contents deleted');
    });
  });
}

// Permanently delete a folder
function deleteFolder(fileName, userId) {
  const query = 'DELETE FROM folders AS f WHERE f.folderName = ? AND f.userId = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [fileName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve('Folder permanently deleted');
    });
  });
}

export { deleteFolderContents, deleteFolder };
