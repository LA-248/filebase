import { db } from '../services/database.mjs';

// Insert folder information into the database
function storeFolderInformation(userId, folderName) {
  const query ='INSERT INTO folders (userId, folderName) VALUES (?, ?)';

  db.run(query, [userId, folderName], err => {
    if (err) {
      console.error('An error occurred when trying to store folder information:', err.message);
    }
    console.log('A row in the folders table has been inserted.');
  });
}

export { storeFolderInformation };
