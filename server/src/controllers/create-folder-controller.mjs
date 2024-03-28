import sanitize from 'sanitize-filename';
import { storeFolderInformation } from '../models/folders.mjs';
import { handleDuplicateNames } from './upload-controller.mjs';

const createFolder = async (req, res) => {
  try {
    const table = 'folders';
    const column = 'folderName';

    const userId = req.user.id;
    let folderName = sanitize(req.body.name);
    const isFavourite = 'false';
    const shared = 'false';
    const deleted = 'false';

    // Folders cannot be named after the default Public folder
    if (folderName === 'Public' || folderName === 'public') {
      res.status(400).json('You may not use this name for a folder');
      return;
    }

    // Check if the user is creating a folder with a name that already exists and modify it if it does
    folderName = await handleDuplicateNames(folderName, table, column, userId);

    // Store the folder information in the database
    storeFolderInformation(userId, folderName, isFavourite, shared, deleted);

    res.status(200).json({ folderName: folderName, type: 'Folder' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('There was an error creating your folder.');
  }
};

export { createFolder };
