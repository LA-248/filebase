import express from 'express';
import { downloadFile } from '../controllers/downloadController.mjs';

const router = express.Router();

// Download a stored file
router.get('/download/:filename', downloadFile);

export default router;
