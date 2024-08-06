import { db } from '../services/database.mjs';

const File = {
  // Function to insert file information into the database
  storeFileInformation: function(userId, rootFolder, folderName, fileName, fileSize, fileExtension, isFavourite, shared, deleted) {
    const query = 'INSERT INTO files (userId, rootFolder, folderName, fileName, fileSize, fileExtension, isFavourite, shared, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
      db.run(query, [userId, rootFolder, folderName, fileName, fileSize, fileExtension, isFavourite, shared, deleted], err => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        console.log('A row in the files table has been inserted.');
        resolve();
      });
    });
  },

  fetchAllStoredFiles: function(userId, parentFolder, deleted) {
    const query = 'SELECT * FROM files AS f WHERE f.userId = ? AND f.folderName = ? AND f.deleted = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId, parentFolder, deleted], (err, files) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(files);
      });
    });
  },

  fetchAllSharedFiles: function(userId, shared, deleted) {
    const query = 'SELECT f.fileName, f.folderName, f.uuid FROM files AS f WHERE f.userId = ? AND f.shared = ? AND f.deleted = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId, shared, deleted], (err, files) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(files);
      });
    });
  },

  fetchAllDeletedFiles: function(userId, deleted) {
    const query = 'SELECT f.fileName, f.folderName FROM files AS f WHERE f.userId = ? AND f.deleted = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId, deleted], (err, files) => {
        if (err) {
          reject(`Database error: ${err.message}`);
        }
        resolve(files);
      });
    });
  },
  
  fetchSizeOfEachFile: function(userId) {
    const query = 'SELECT f.fileName, f.folderName, f.fileSize, f.uuid FROM files AS f WHERE f.userId = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId], (err, files) => {
        if (err) {
          reject(`Database error: ${err.message}`);
        }
        resolve(files);
      });
    });
  },
  
  // Retrieve the last file uploaded
  fetchLastFileUploaded: function(userId) {
    const query = 'SELECT f.fileName FROM files AS f WHERE userId = ? ORDER BY id DESC LIMIT 1';
  
    return new Promise((resolve, reject) => {
      db.get(query, [userId], (err, latestFile) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        console.log('Last uploaded file:', latestFile.fileName);
        resolve(latestFile.fileName);
      });
    });
  },
  
  // Retrieve file metadata by filename and userId - used for file previews
  getFileDataByFileNameAndUserId: function(fileName, userId) {
    const query = 'SELECT f.fileName, f.folderName, f.fileExtension FROM files AS f WHERE f.fileName = ? AND f.userId = ?';
  
    return new Promise((resolve, reject) => {
      db.get(query, [fileName, userId], (err, row) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(row);
      });
    });
  },
  
  // Retrieve file metadata by uuid - used for individual shared file previews
  getFileDataByUuid: function(uuid) {
    const query = 'SELECT f.fileName, f.folderName, f.fileExtension FROM files AS f WHERE f.uuid = ?';
  
    return new Promise((resolve, reject) => {
      db.get(query, [uuid], (err, row) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(row);
      });
    });
  },
  
  // TODO: Rename this function to something more descriptive
  getFileDataByFileNameAndUserIdAndSharedStatus: function(fileName, userId, sharedStatus) {
    const query = 'SELECT f.fileName, f.folderName, f.fileExtension FROM files AS f JOIN folders fo ON f.folderName = fo.folderName WHERE f.fileName = ? AND f.userId = ? AND fo.shared = ?';
  
    return new Promise((resolve, reject) => {
      db.get(query, [fileName, userId, sharedStatus], (err, row) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(row);
      });
    });
  },
  
  // Get the size of a file
  getFileSize: function(userId) {
    const query = 'SELECT f.fileSize FROM files AS f WHERE f.userId = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(rows);
      });
    });
  },
  
  // Retrieve all favourited files
  fetchFavouritedFiles: function(userId, isFavourite, deleted) {
    const query = 'SELECT f.fileName, f.folderName, f.uuid FROM files AS f WHERE f.userId = ? AND f.isFavourite = ? AND f.deleted = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId, isFavourite, deleted], (err, rows) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(rows);
      });
    });
  },
  
  // Fetch the uuid for a file or folder
  fetchUuid: function(table, column, itemName, userId) {
    const query = `SELECT f.uuid, f.shared FROM ${table} AS f WHERE f.${column} = ? AND f.userId = ?`;
  
    return new Promise((resolve, reject) => {
      db.get(query, [itemName, userId], (err, rows) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(rows);
      });
    });
  },
  
  // Fetch the shared status of a file or folder from the database
  retrieveSharedStatusFromDatabase: function(table, column, itemName, userId) {
    const query = `SELECT f.shared FROM ${table} AS f WHERE f.${column} = ? AND f.userId = ?`;
  
    return new Promise((resolve, reject) => {
      db.get(query, [itemName, userId], (err, row) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(row);
      });
    });
  },

  // Update the deleted status of a file
  updateFileDeletionStatus: function(deleted, fileName, userId) {
    const query = 'UPDATE files SET deleted = ? WHERE fileName = ? AND userId = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [deleted, fileName, userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve('File deletion status updated');
      });
    });
  },

  // Update favourite status
  updateFavouritedStatus: function(table, column, favourited, itemName, userId) {
    const query = `UPDATE ${table} SET isFavourite = ? WHERE ${column} = ? AND userId = ?`;

    return new Promise((resolve, reject) => {
      db.run(query, [favourited, itemName, userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve();
      });
    })
  },

  // Create new uuid for a file/folder and also update shared status
  updateUuidAndSharedStatus: function(table, column, sharedStatus, uuid, itemName, userId) {
    const query = `UPDATE ${table} SET shared = ?, uuid = ? WHERE ${column} = ? AND userId = ?`;

    return new Promise((resolve, reject) => {
      db.run(query, [sharedStatus, uuid, itemName, userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve();
      });
    });
  },

  // When a file is renamed, update it in the database
  updateFileName: function(newName, userId, fileName) {
    const query = 'UPDATE files SET fileName = ? WHERE userId = ? AND fileName = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [newName, userId, fileName], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve();
      });
    });
  },

  permanentlyDeleteFileFromDatabase: function(fileName, userId) {
    const query = 'DELETE FROM files AS f WHERE f.fileName = ? AND f.userId = ?';
  
    return new Promise((resolve, reject) => {
      db.run(query, [fileName, userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve('File permanently deleted');
      });
    });
  },
  
  // Delete the uuid for a file or folder
  deleteUuidFromDatabase: function(table, column, sharedStatus, uuid, itemName, userId) {
    const query = `UPDATE ${table} SET shared = ?, uuid = ? WHERE ${column} = ? AND userId = ?`;
  
    return new Promise((resolve, reject) => {
      db.run(query, [sharedStatus, uuid, itemName, userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve();
      });
    });
  },
}

export { File };
