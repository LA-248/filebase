import { db } from '../services/database.mjs';

const Folder = {
  // INSERT OPERATIONS

  // Insert folder information into the database
  storeFolderInformation: function(userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder) {
    const query ='INSERT INTO folders (userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder) VALUES (?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
      db.run(query, [userId, rootFolder, folderName, isFavourite, shared, deleted, parentFolder], err => {
        if (err) {
          reject(new Error(`Error storing folder information: ${err.message}`));
        }
        resolve();
      });
    });
  },

  // READ OPERATIONS

  fetchAllStoredFolders: function(userId, parentFolder, deleted) {
    const query = 'SELECT * FROM folders AS f WHERE f.userId = ? AND f.parentFolder = ? AND f.deleted = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId, parentFolder, deleted], (err, folders) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(folders);
      });
    });
  },
  
  fetchAllSharedFolders: function(userId, shared, deleted) {
    const query = 'SELECT f.folderName, f.parentFolder, f.uuid FROM folders AS f WHERE f.userId = ? AND f.shared = ? AND f.deleted = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId, shared, deleted], (err, folders) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(folders);
      });
    });
  },
  
  fetchAllDeletedFolders: function(userId, deleted) {
    const query = 'SELECT f.folderName, f.parentFolder FROM folders AS f WHERE f.userId = ? AND f.deleted = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId, deleted], (err, folders) => {
        if (err) {
          reject(`Database error: ${err.message}`);
        }
        resolve(folders);
      });
    });
  },
  
  // Retrieve the contents of a folder
  retrieveFolderContents: function(folderName, userId) {
    const query = 'SELECT f.fileName FROM files AS f WHERE f.folderName = ? AND f.userId = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [folderName, userId], (err, rows) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(rows);
      });
    });
  },
  
  // Retrieve all favourited folders
  fetchFavouritedFolders: function(userId, isFavourite, isDeleted) {
    const query = 'SELECT f.folderName, f.parentFolder, f.uuid FROM folders AS f WHERE f.userId = ? AND f.isFavourite = ? AND f.deleted = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [userId, isFavourite, isDeleted], (err, rows) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(rows);
      });
    });
  },
  
  fetchFolderNameByUuid: function(uuid) {
    const query = 'SELECT folderName, userId FROM folders WHERE uuid = ?';
  
    return new Promise((resolve, reject) => {
      db.get(query, [uuid], (err, folder) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(folder);
      });
    });
  },
  
  fetchFilesInSharedFolder: function(folderName, deleted, userId) {
    const query = 'SELECT f.fileName, f.userId, u.id FROM files AS f INNER JOIN users AS u ON f.userId = u.id WHERE f.folderName = ? AND f.deleted = ? AND f.userId = ?';
  
    return new Promise((resolve, reject) => {
      db.all(query, [folderName, deleted, userId], (err, files) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve(files);
      });
    });
  },

  // UPDATE OPERATIONS

  // Update the deleted status of a folder
  updateFolderDeletionStatus: function(deleted, folderName, userId) {
    const query = 'UPDATE folders SET deleted = ? WHERE folderName = ? AND userId = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [deleted, folderName, userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve('Folder deletion status updated');
      });
    });
  },

  updateFolderName: function(newName, userId, folderName) {
    const query = 'UPDATE folders SET folderName = ? WHERE userId = ? AND folderName = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [newName, userId, folderName], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve();
      });
    });
  },

  // Update 'parentFolder' name in 'folders' for changed parent directory associations
  updateFolderParentFolder: function(newName, userId, folderName) {
    const query = 'UPDATE folders SET parentFolder = ? WHERE userId = ? AND parentFolder = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [newName, userId, folderName], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve();
      });
    });
  },

  // Update 'folderName' in 'files' for changed parent directory associations
  updateFileParentFolder: function(newName, userId, folderName) {
    const query = 'UPDATE files SET folderName = ? WHERE userId = ? AND folderName = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [newName, userId, folderName], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve();
      });
    });
  },

  // DELETE OPERATIONS

  deleteFoldersByUserId: function(userId) {
    const query = 'DELETE FROM folders AS f WHERE f.userId = ?';
  
    return new Promise((resolve, reject) => {
      db.run(query, [userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve();
      });
    });
  },

  // Delete all content that exists within a certain folder
  deleteFolderContents: function(folderName, userId) {
    const query = 'DELETE FROM files AS f WHERE f.folderName = ? AND f.userId = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [folderName, userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve('Folder contents deleted');
      });
    });
  },

  // Permanently delete a folder
  deleteFolder: function(fileName, userId) {
    const query = 'DELETE FROM folders AS f WHERE f.folderName = ? AND f.userId = ?';

    return new Promise((resolve, reject) => {
      db.run(query, [fileName, userId], (err) => {
        if (err) {
          reject(new Error(`Database error: ${err.message}`));
        }
        resolve('Folder permanently deleted');
      });
    });
  },
}

export { Folder };
