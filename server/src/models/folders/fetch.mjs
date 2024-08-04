import { db } from '../../services/database.mjs';

// Retrieve the contents of a folder
function retrieveFolderContents(folderName, userId) {
  const query = 'SELECT f.fileName FROM files AS f WHERE f.folderName = ? AND f.userId = ?';

  return new Promise((resolve, reject) => {
    db.all(query, [folderName, userId], (err, rows) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve(rows);
    });
  });
}

// Retrieve all favourited folders
function fetchFavouritedFolders(userId, isFavourite, isDeleted) {
  const query = 'SELECT f.folderName, f.parentFolder, f.uuid FROM folders AS f WHERE f.userId = ? AND f.isFavourite = ? AND f.deleted = ?';

  return new Promise((resolve, reject) => {
    db.all(query, [userId, isFavourite, isDeleted], (err, rows) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve(rows);
    });
  });
}

export { retrieveFolderContents, fetchFavouritedFolders };
