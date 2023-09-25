import express from 'express';
import displayUploadedFiles from '../public/file-list.mjs';

const router = express.Router();

router.get('/getFiles', async (req, res) => {
  const fileList = await displayUploadedFiles();
  res.json({ fileList });
});

export default router;
