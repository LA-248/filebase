import express from 'express';
import { retrieveFileData } from '../controllers/file-data-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Download a stored file
router.get('/download/:filename', authMiddleware, retrieveFileData);

export default router;
