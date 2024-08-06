import sanitize from 'sanitize-filename';
import { Folder } from '../models/folder-model.mjs';
import { handleDuplicateNames } from '../utils/duplicate-name-handler.mjs';

// Handle folder creation and store relevant information in database
const createFolder = async (req, res) => {
  try {
    const table = 'folders';
    const column = 'folderName';

    const userId = req.user.id;
    const rootFolder = req.body.rootFolder;
    let folderName = sanitize(req.body.name);
    const isFavourite = 'false';
    const shared = 'false';
    const deleted = 'false';
    const parentFolder = req.body.parentFolder;

    if (folderName === '') {
      return res.status(400).json({ message: 'Please enter a name for your folder' });
    }

    // Check for duplicate folder names
    folderName = await handleDuplicateNames(folderName, table, column, userId);

    // Store the folder information in the database
    await Folder.storeFolderInformation(
      userId,
      rootFolder,
      folderName,
      isFavourite,
      shared,
      deleted,
      parentFolder
    );

    res.status(200).json({ folderName: folderName, type: 'Folder' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'There was an error creating your folder.' });
  }
};

export { createFolder };
