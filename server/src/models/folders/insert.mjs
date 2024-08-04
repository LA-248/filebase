import { db } from '../../services/database.mjs';

// Insert folder information into the database
function storeFolderInformation(userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder) {
  const query ='INSERT INTO folders (userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder) VALUES (?, ?, ?, ?, ?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.run(query, [userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder], err => {
      if (err) {
        reject(new Error(`Error storing folder information: ${err.message}`));
      }
      console.log('A row in the folders table has been inserted.');
      resolve();
    });
  });
}

export { storeFolderInformation };
