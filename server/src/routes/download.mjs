import express from 'express';
import { sendFileBufferForDownload } from '../controllers/download-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Download a stored file
router.get('/download/:filename', authMiddleware, sendFileBufferForDownload);

export default router;
