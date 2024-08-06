import { File } from '../models/file-model.mjs';

// Retrieve the shared status of a file or folder
export const fetchSharedStatus = (table, column) => async (req, res) => {
  try {
    const itemName = req.params.name;
    const userId = req.user.id;

    const row = await File.retrieveSharedStatusFromDatabase(table, column, itemName, userId);
    return res.status(200).json({ sharedStatus: row });
  } catch (error) {
    console.error('Error retrieving shared status:', error);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};
