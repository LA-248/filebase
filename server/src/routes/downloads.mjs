import express from 'express';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Download a stored file
router.get('/download/:filename', (req, res) => {
  try {
    // Retrieve the path of the file to be downloaded
    const filePath = path.join(__dirname, '../../uploads', req.params.filename);
    console.log(filePath);
    // Download the file at the specified path
    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

export default router;
