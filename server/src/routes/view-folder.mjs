import express from 'express';
import { displayFilesInFolder } from '../controllers/display-files-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Preview a stored file
router.get('/folder/:foldername', authMiddleware, displayFilesInFolder);

export default router;
