import express from 'express';
import { previewFile } from '../controllers/previews-controller.mjs';

const router = express.Router();

router.get('/preview/:filename', previewFile);

router.get('/preview', (req, res) => {
  res.render('../views/preview.ejs', {
    title: 'Preview',
    header: 'File',
    imageUrl: 'https://i.imgur.com/SvCBxpm.jpeg',
  });
});

export default router;
