import express from 'express';
import { displayStoredFilesAndFolders } from '../controllers/display-files-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

router.get('/home', authMiddleware, displayStoredFilesAndFolders);

export default router;
