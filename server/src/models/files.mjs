import { db } from '../services/database.mjs';

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

// Retrieve the last file uploaded
function fetchLastFileUploaded(userId) {
  const query = 'SELECT f.fileName FROM files AS f WHERE userId = ? ORDER BY id DESC LIMIT 1';
  
  return new Promise((resolve, reject) => {
    db.get(query, [userId], (err, latestFile) => {
      if (err) {
        console.error('An error occurred when fetching the last uploaded file:', err.message);
        reject(new Error(`Database error: ${err.message}`));
      }
      console.log('Last uploaded file:', latestFile.fileName);
      resolve(latestFile.fileName);
    });
  });
}

// Retrieve file metadata
function getFileData(fileName, userId) {
  const query = 'SELECT f.fileName, f.folderName, f.fileExtension FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  return new Promise((resolve, reject) => {
    db.get(query, [fileName, userId], (err, row) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve(row);
    });
  });
}

// Get the size of a file
function getFileSize(userId) {
  const query = 'SELECT f.fileSize FROM files AS f WHERE f.userId = ?';

  return new Promise((resolve, reject) => {
    db.all(query, [userId], (err, rows) => {
      if (err) {
        reject (new Error(`Database error: ${err.message}`));
      }
      resolve(rows);
    });
  });
}

// Update the deleted status of a file
function updateFileDeletionStatus(deleted, fileName, userId) {
  const query = 'UPDATE files SET deleted = ? WHERE fileName = ? AND userId = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [deleted, fileName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve('File deletion status updated');
    });
  });
}

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

export {
  storeFileInformation,
  fetchLastFileUploaded,
  getFileData,
  getFileSize,
  updateFileDeletionStatus,
  permanentlyDeleteFileFromDatabase,
};
