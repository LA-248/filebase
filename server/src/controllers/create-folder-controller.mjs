import { storeFolderInformation } from '../models/folders.mjs';

const createFolder = (req, res) => {
  try {
    const userId = req.user.id;
    const folderName = req.body.name;

    // Store the folder information in the database
    storeFolderInformation(userId, folderName);

    res.status(200).json({ folderName: folderName, type: 'Folder' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('There was an error creating your folder.');
  }
};

export { createFolder };
