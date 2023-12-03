import displayUploadedFiles from '../services/file-list.mjs';

export const getStoredFiles = async (req, res) => {
  // Retrieve the list of uploaded files
  const fileList = await displayUploadedFiles();
  // Map the fileList into an array of objects, each with an 'id' and 'fileName'
  const indexedFileList = fileList.map((file, index) => ({
    id: index,
    fileName: file,
  }));
  res.json({ indexedFileList });
};
