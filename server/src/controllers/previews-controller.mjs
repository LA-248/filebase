import { db } from '../services/database.mjs';

export const previewFile = (req, res) => {
  const query = 'SELECT f.fileData FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  db.get(query, [req.params.filename, req.user.id], (err, row) => {
    if (err) {
      res.status(500).send('Database error.');
    } else {
      // Send the file data retrieved from the database as a response
      res.send(row.fileData);
    }
  });
};
