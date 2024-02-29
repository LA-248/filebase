import { db } from '../services/database.mjs';
import generateUUID from '../services/uuid-generator.mjs';

// Create new uuid for a file and update it in the database - also modify shared status
const createNewUuid = async (req, res) => {
  const updateUuid = 'UPDATE files SET shared = ?, uuid = ? WHERE fileName = ? AND userId = ?';

  const uuid = generateUUID();
  const shared = 'true';

  db.run(updateUuid, [shared, uuid, req.params.filename, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json({ fileUuid: uuid });
  });
};

// Delete the uuid for a file and modify shared status
const deleteUuid = async (req, res) => {
  const deleteUuid = 'UPDATE files SET shared = ?, uuid = ? WHERE fileName = ? AND userId = ?';

  const shared = 'false';

  db.run(deleteUuid, [shared, '', req.params.filename, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json({ sharedStatus: shared });
  });
};

export { createNewUuid, deleteUuid };
