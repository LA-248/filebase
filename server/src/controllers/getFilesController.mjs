import displayUploadedFiles from '../services/file-list.mjs';

export const getStoredFiles = async (req, res) => {
  const fileList = await displayUploadedFiles();
  const indexedFileList = fileList.map((file, index) => ({
    id: index,
    fileName: file,
  }));
  res.json({ indexedFileList });
};
