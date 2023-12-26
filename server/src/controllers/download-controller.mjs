import { db } from "../services/database.mjs";

// Retrieve file buffer from database and send it as a response for file downloads
export const sendFileBufferForDownload = (req, res) => {
  const query = 'SELECT f.fileData FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  db.get(query, [req.params.filename, req.user.id], (err, row) => {
    if (err) {
      res.status(500).send('Database error.');
    } else {
      res.send(row.fileData);
    }
  });
};