import { storeFileInformation, fetchLastFileUploaded } from '../models/files.mjs';

export const uploadFile = (req, res) => {
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

    console.log(userId, fileName, fileSize, fileData);
  } else {
    res.status(401).send('User not authenticated');
  }
};
