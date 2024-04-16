import { db } from '../services/database.mjs';
import generateUUID from '../services/uuid-generator.mjs';

// Create new uuid for a file/folder and update it in the database - also update shared status
const createNewUuid = (table, column) => (req, res) => {
  const updateUuid = `UPDATE ${table} SET shared = ?, uuid = ? WHERE ${column} = ? AND userId = ?`;

  const shared = 'true';
  const uuid = generateUUID();

  db.run(updateUuid, [shared, uuid, req.params.name, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json({ uuid: uuid });
  });
};

// Delete the uuid for a file/folder and update shared status
const deleteUuid = (table, column) => (req, res) => {
  const deleteUuid = `UPDATE ${table} SET shared = ?, uuid = ? WHERE ${column} = ? AND userId = ?`;

  const shared = 'false';
  const uuid = '';

  db.run(deleteUuid, [shared, uuid, req.params.name, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json({ sharedStatus: shared });
  });
};

// Retrieve the uuid for a file/folder
const retrieveUuid = (table, column) => (req, res) => {
  const retrieveUuid = `SELECT f.uuid, f.shared FROM ${table} AS f WHERE f.${column} = ? AND f.userId = ?`;

  db.get(retrieveUuid, [req.params.name, req.user.id], (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json({ uuid: row.uuid, sharedStatus: row.shared });
  });
}

export { createNewUuid, deleteUuid, retrieveUuid };
