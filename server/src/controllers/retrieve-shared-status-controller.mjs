import { db } from '../services/database.mjs';

// Retrieve the shared status of a file
export const fetchSharedStatus = async (req, res) => {
  const query = 'SELECT f.shared FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  db.get(query, [req.params.filename, req.user.id], (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json({ sharedStatus: row });
  });
};
