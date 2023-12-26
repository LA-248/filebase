import express from 'express';
import { previewFile } from '../controllers/preview-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Preview a stored file
router.get('/preview/:filename', authMiddleware, previewFile);

export default router;
