import { db } from '../services/database.mjs';

// Insert folder information into the database
function storeFolderInformation(userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder) {
  const query ='INSERT INTO folders (userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder) VALUES (?, ?, ?, ?, ?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.run(query, [userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder], err => {
      if (err) {
        console.error('An error occurred when trying to store folder information:', err.message);
        reject('Database error.');
      }

      console.log('A row in the folders table has been inserted.');
      resolve();
    });
  });
}

export { storeFolderInformation };
