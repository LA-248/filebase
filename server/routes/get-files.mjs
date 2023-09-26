import express from 'express';
import displayUploadedFiles from '../public/file-list.mjs';

const router = express.Router();

router.get('/getFiles', async (req, res) => {
  const fileList = await displayUploadedFiles();
  const indexedFileList = fileList.map((file, index) => ({id: index, fileName: file}));
  res.json([{ indexedFileList }]);
});

export default router;
