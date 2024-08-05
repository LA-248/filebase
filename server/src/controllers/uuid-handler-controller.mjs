import { deleteUuidFromDatabase } from '../models/files/delete.mjs';
import { fetchUuid } from '../models/files/fetch.mjs';
import { updateUuidAndSharedStatus } from '../models/files/update.mjs';
import { db } from '../services/database.mjs';
import generateUUID from '../utils/uuid-generator.mjs';

// Create new uuid for a file/folder and update it in the database - also update shared status
const createNewUuid = (table, column) => async (req, res) => {
  try {
    const shared = 'true';
    const uuid = generateUUID();
    const itemName = req.params.name;
    const userId = req.user.id;
  
    await updateUuidAndSharedStatus(table, column, shared, uuid, itemName, userId);
    return res.status(200).json({ uuid: uuid });
  } catch (error) {
    console.error('Error creating uuid:', error);
    return res.status(500).json({ message: 'Error creating link, please try again' });
  }
};

// Delete the uuid for a file/folder and update shared status
const deleteUuid = (table, column) => async (req, res) => {
  try {
    const shared = 'false';
    const uuid = '';
    const itemName = req.params.name;
    const userId = req.user.id;
  
    await deleteUuidFromDatabase(table, column, shared, uuid, itemName, userId)
    return res.status(200).json({ sharedStatus: shared });
  } catch (error) {
    console.error('Error deleting uuid:', error);
    return res.status(500).json({ message: 'Error deleting shareable link. Please try again.' });
  }
};

// Retrieve the uuid for a file/folder
const retrieveUuid = (table, column) => async (req, res) => {
  try {
    const itemName = req.params.name;
    const userId = req.user.id;

    const rows = await fetchUuid(table, column, itemName, userId);
    return res.status(200).json({ uuid: rows.uuid, sharedStatus: rows.shared });
  } catch (error) {
    console.error('Error retrieving uuid:', error);
    return res.status(500).json({ message: 'Error retrieving uuid.' })
  }
};

export { createNewUuid, deleteUuid, retrieveUuid };
