import { db } from '../services/database.mjs';

// Function to insert file information into the database
export default function storeFileInformation(userId, fileName, fileSize, fileData) {
  const query ='INSERT INTO files (userId, fileName, fileSize, fileData) VALUES (?, ?, ?, ?)';

  db.run(query, [userId, fileName, fileSize, fileData], err => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted`);
  });
}
