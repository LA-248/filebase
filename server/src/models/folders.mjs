import { db } from '../services/database.mjs';

// Insert folder information into the database
export default function storeFolderInformation(userId, folderName, fileInformation) {
  /*
  Since SQLite doesn't natively support storing arrays or objects directly -
  need to convert the array of objects (fileInformation) to a string format
  */
  const fileInformationString = JSON.stringify(fileInformation);

  const query ='INSERT INTO folders (userId, folderName, fileInformation) VALUES (?, ?, ?)';

  db.run(query, [userId, folderName, fileInformationString], err => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row in the folders table has been inserted`);
  });
}
