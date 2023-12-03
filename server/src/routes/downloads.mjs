import express from 'express';
import { downloadFile } from '../controllers/download-controller.mjs';

const router = express.Router();

// Download a stored file
router.get('/download/:filename', downloadFile);

export default router;
