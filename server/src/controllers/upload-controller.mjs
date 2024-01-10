import { storeFileInformation, fetchLastFileUploaded } from '../models/files.mjs';

const uploadFile = (req, res) => {
  try {
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

    res.status(200).json({ userId: userId, fileName: fileName });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json('There was an error uploading your file.')  
  }
};

// Upload files that exist within a folder
const uploadFolder = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;
    let uploadedFiles = [];

    // Loop through each file in the folder, retrieve the relevant information, and then store it in the database
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].originalname;
      const fileSizeBytes = files[i].size;
      const fileData = files[i].buffer;
      // Convert file size from bytes to megabytes
      const fileSize = (fileSizeBytes / (1024 * 1024)).toFixed(2);

      await storeFileInformation(userId, fileName, fileSize, fileData);
      await fetchLastFileUploaded(userId);

      // Push the name of each file into an array
      uploadedFiles.push(fileName);
    }

    res.status(200).json({ fileNames: uploadedFiles });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json('There was an error uploading your folder contents.')  
  }
};

export { uploadFile, uploadFolder };
