import { db } from '../services/database.mjs';

// Function to insert file information into the database
function storeFileInformation(userId, folderName, fileName, fileSize, isFavourite, shared) {
  const query = 'INSERT INTO files (userId, folderName, fileName, fileSize, isFavourite, shared) VALUES (?, ?, ?, ?, ?, ?)';

  db.run(query, [userId, folderName, fileName, fileSize, isFavourite, shared], err => {
    if (err) {
      console.error('An error occurred when trying to store file information:', err.message);
    }
    console.log('A row in the files table has been inserted.');
  });
}

// Retrieve the last file uploaded
function fetchLastFileUploaded(userId) {
  const query = 'SELECT f.fileName FROM files AS f WHERE userId = ? ORDER BY id DESC LIMIT 1';
  
  db.get(query, [userId], (err, latestFile) => {
    if (err) {
      console.error('An error occurred when fetching the last uploaded file:', err.message);
    }
    console.log(latestFile.fileName);
  });
}

export { storeFileInformation, fetchLastFileUploaded };
