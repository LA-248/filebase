import { db } from '../services/database.mjs';

export const deleteFile = (req, res) => {
  const query = 'DELETE FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  db.get(query, [req.params.filename, req.user.id], err => {
    if (err) {
      res.status(500).json('Database error.');
    } else {
      res.status(200).json('File was successfully deleted.');
      console.log(`File ${req.params.filename} was successfully deleted`);
    }
  });
};
