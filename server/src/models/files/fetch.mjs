import { db } from '../../services/database.mjs';

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

// Retrieve file metadata - used for file previews
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
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve(rows);
    });
  });
}

// Retrieve all favourited files
function fetchFavouritedFiles(userId, isFavourite, deleted) {
  const query = 'SELECT f.fileName, f.folderName, f.uuid FROM files AS f WHERE f.userId = ? AND f.isFavourite = ? AND f.deleted = ?';

  return new Promise((resolve, reject) => {
    db.all(query, [userId, isFavourite, deleted], (err, rows) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve(rows);
    });
  });
}

// Fetch the uuid for a file or folder
function fetchUuid(table, column, itemName, userId) {
  const query = `SELECT f.uuid, f.shared FROM ${table} AS f WHERE f.${column} = ? AND f.userId = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [itemName, userId], (err, rows) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve(rows);
    });
  });
}

// Fetch the shared status of a file or folder from the database
function retrieveSharedStatusFromDatabase(table, column, itemName, userId) {
  const query = `SELECT f.shared FROM ${table} AS f WHERE f.${column} = ? AND f.userId = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [itemName, userId], (err, row) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve(row);
    });
  });
}

export {
  fetchLastFileUploaded,
  getFileData,
  getFileSize,
  fetchFavouritedFiles,
  fetchUuid,
  retrieveSharedStatusFromDatabase,
};
