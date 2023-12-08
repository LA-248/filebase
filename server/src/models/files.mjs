import { db } from '../services/database.mjs';

export default function storeFileInformation(userId, fileName, fileData) {
  const query ='INSERT INTO files (userId, fileName, fileData) VALUES (?, ?, ?)';

  db.run(query, [userId, fileName, fileData], function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted`);
  });
}
