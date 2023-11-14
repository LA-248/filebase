import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('/preview/:filename', (req, res) => {
  try {
    // Get the path of the file to then retrieve the blob
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

export default router;
