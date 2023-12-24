import { storeFileInformation, fetchLastFileUploaded } from '../models/files.mjs';

const uploadFile = (req, res) => {
  if (req.isAuthenticated()) {
    // Retrieve user and file information on upload
    const userId = req.user.id;
    const fileName = req.file.originalname;
    const fileSizeBytes = req.file.size;
    const fileData = req.file.buffer;

    // Convert file size from bytes to megabytes
    const fileSize = (fileSizeBytes / (1024 * 1024)).toFixed(2);

    // Store the retrieved information in the database
    storeFileInformation(userId, fileName, fileSize, fileData);
    fetchLastFileUploaded(userId);

    res.status(200).json('File successfully uploaded!');
  } else {
    res.status(401).send('User not authenticated');
  }
};

// Upload files that exist within a folder
const uploadFolder = (req, res) => {
  if (req.isAuthenticated()) {
    // Retrieve user and file information on upload
    const userId = req.user.id;

    // Loop through each file in the folder, retrieve the relevant information, and then store it in the database
    const files = req.files;
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].originalname;
      const fileSizeBytes = files[i].size;
      const fileData = files[i].buffer;
      // Convert file size from bytes to megabytes
      const fileSize = (fileSizeBytes / (1024 * 1024)).toFixed(2);

      storeFileInformation(userId, fileName, fileSize, fileData);
      fetchLastFileUploaded(userId);
    }

    res.status(200).json('Folder contents successfully uploaded!');
  } else {
    res.status(401).send('User not authenticated');
  }
};

export { uploadFile, uploadFolder };
