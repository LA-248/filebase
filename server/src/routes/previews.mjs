import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('/preview/:filename', (req, res) => {
  try {
    // Get the path of the file to then retrieve the blob
    const filePath = path.join(__dirname, '../../uploads', req.params.filename);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.get('/preview', (req, res) => {
  res.render('../views/preview.ejs', {
    title: 'Preview',
    header: 'File',
    imageUrl: 'https://i.imgur.com/SvCBxpm.jpeg',
  });
});

export default router;
