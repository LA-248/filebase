import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/preview/:filename', (req, res) => {
  try {
    // Get the path of the file to then retrieve the blob
    const filePath = path.join(`C:/Users/lucaa/Dropbox/Code/Projects/cloud-storage/server/uploads/${req.params.filename}`);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

export default router;
