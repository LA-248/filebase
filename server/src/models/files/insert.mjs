import { db } from '../../services/database.mjs';

// Function to insert file information into the database
function storeFileInformation(userId, rootFolder, folderName, fileName, fileSize, fileExtension, isFavourite, shared, deleted) {
  const query = 'INSERT INTO files (userId, rootFolder, folderName, fileName, fileSize, fileExtension, isFavourite, shared, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.run(query, [userId, rootFolder, folderName, fileName, fileSize, fileExtension, isFavourite, shared, deleted], err => {
      if (err) {
        console.error('An error occurred when trying to store file information:', err.message);
        reject(new Error(`Database error: ${err.message}`));
      }
      console.log('A row in the files table has been inserted.');
      resolve();
    });
  });
}

export { storeFileInformation };
