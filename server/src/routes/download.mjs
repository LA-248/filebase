import express from 'express';
import { sendPresignedUrlForDownload } from '../controllers/download-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Download a stored file
router.get('/files/:filename/download', authMiddleware, sendPresignedUrlForDownload);

export default router;
