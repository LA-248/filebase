import storeFolderInformation from '../models/folders.mjs';

const createFolder = async (req, res) => {
  try {
    const userId = req.user.id;
    const folderName = req.body.name;

    let fileInformation = [
      {
        name: 'test',
        size: '20',
        data: 'data',
      },
    ];

    // Store the folder information in the database
    await storeFolderInformation(userId, folderName, fileInformation);

    res.status(200).json({ folderName: folderName, type: 'Folder' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json('There was an error uploading your file.');
  }
};

export { createFolder };
