import { db } from '../services/database.mjs';

// Function to insert file information into the database
function storeFileInformation(userId, folderName, fileName, fileSize, isFavourite, uuid, fileData) {
  const query = 'INSERT INTO files (userId, folderName, fileName, fileSize, isFavourite, uuid, fileData) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.run(query, [userId, folderName, fileName, fileSize, isFavourite, uuid, fileData], err => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row in the files table has been inserted`);
  });
}

// Retrieve the last file uploaded
function fetchLastFileUploaded(userId) {
  const query = 'SELECT f.fileName FROM files AS f WHERE userId = ? ORDER BY id DESC LIMIT 1';
  
  db.get(query, [userId], (err, latestFile) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(latestFile.fileName);
  });
}

export { storeFileInformation, fetchLastFileUploaded };
