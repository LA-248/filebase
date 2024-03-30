import sanitize from 'sanitize-filename';
import { storeFolderInformation } from '../models/folders.mjs';
import { handleDuplicateNames } from './upload-controller.mjs';

// Handle folder creation and store relevant information in database
const createFolder = async (req, res) => {
  try {
    const table = 'folders';
    const column = 'folderName';

    const userId = req.user.id;
    let folderName = sanitize(req.body.name);
    const isFavourite = 'false';
    const shared = 'false';
    const deleted = 'false';
    const currentFolder = req.body.currentFolder;

    if (folderName === '') {
      res.status(400).json('Please enter a name for your folder');
      return;
    };

    // Check for duplicate folder names
    folderName = await handleDuplicateNames(folderName, table, column, userId);

    // Store the folder information in the database
    storeFolderInformation(userId, folderName, isFavourite, shared, deleted, currentFolder);

    res.status(200).json({ folderName: folderName, type: 'Folder' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('There was an error creating your folder.');
  }
};

export { createFolder };
