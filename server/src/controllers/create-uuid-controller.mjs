import { db } from '../services/database.mjs';
import generateUUID from '../services/uuid-generator.mjs';

// Create new uuid for a file and update it in the database
export const createNewUuid = async (req, res) => {
  const uuid = generateUUID();

  const updateUuid = 'UPDATE files SET uuid = ? WHERE fileName = ? AND userId = ?';

  db.run(updateUuid, [uuid, req.params.filename, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json({ fileUuid: uuid });
  });
};
