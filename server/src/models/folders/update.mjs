import { db } from '../../services/database.mjs';

// Update the deleted status of a folder
function updateFolderDeletionStatus(deleted, folderName, userId) {
  const query = 'UPDATE folders SET deleted = ? WHERE folderName = ? AND userId = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [deleted, folderName, userId], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve('Folder deletion status updated');
    });
  });
}

function updateFolderName(newName, userId, folderName) {
  const query = 'UPDATE folders SET folderName = ? WHERE userId = ? AND folderName = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [newName, userId, folderName], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve();
    })
  });
}

// Update 'parentFolder' name in 'folders' for changed parent directory associations
function updateFolderParentFolder(newName, userId, folderName) {
  const query = 'UPDATE folders SET parentFolder = ? WHERE userId = ? AND parentFolder = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [newName, userId, folderName], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve();
    });
  });
}

// Update 'folderName' in 'files' for changed parent directory associations
function updateFileParentFolder(newName, userId, folderName) {
  const query = 'UPDATE files SET folderName = ? WHERE userId = ? AND folderName = ?';

  return new Promise((resolve, reject) => {
    db.run(query, [newName, userId, folderName], (err) => {
      if (err) {
        reject(new Error(`Database error: ${err.message}`));
      }
      resolve();
    });
  });
}

export {
  updateFolderDeletionStatus,
  updateFolderName,
  updateFolderParentFolder,
  updateFileParentFolder
};
