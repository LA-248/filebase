import express from 'express';
import { displayFilesInFolder } from '../controllers/display-files-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Display a folder and its contents
router.get('/folder/:foldername', authMiddleware, displayFilesInFolder);

export default router;
