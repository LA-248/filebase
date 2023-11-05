import express from 'express';
import path from 'path';

const router = express.Router();

// Download a stored file
router.get('/download/:filename', (req, res) => {
  try {
    // Retrieve the path of the file to be downloaded
    const filePath = path.join(`C:/Users/lucaa/Dropbox/Code/Projects/cloud-storage/server/uploads/${req.params.filename}`);
    // Download the file at the specified path
    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

export default router;
