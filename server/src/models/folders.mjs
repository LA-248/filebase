import { db } from '../services/database.mjs';

// Insert folder information into the database
function storeFolderInformation(userId, folderName) {
  const query ='INSERT INTO folders (userId, folderName) VALUES (?, ?)';

  db.run(query, [userId, folderName], err => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row in the folders table has been inserted`);
  });
}

function storeFileInFolder(fileInformation) {
  /*
  Since SQLite doesn't natively support storing arrays or objects directly -
  need to convert the array of objects (fileInformation) to a string format
  */
  const fileInformationString = JSON.stringify(fileInformation);

  const query = 'INSERT INTO folders (userId, folderName, fileName, fileSize, fileData) VALUES (?, ?, ?, ?, ?)';

  db.run(query, [fileInformationString], err => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`File added to the folder.`);
  });
}

export { storeFolderInformation, storeFileInFolder };
