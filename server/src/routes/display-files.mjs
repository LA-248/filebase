import express from 'express';
import { displayStoredFilesAndFolders, displaySharedFiles, displayDeletedFiles } from '../controllers/display-files-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Display all files and folders in the home screen
router.get('/home', authMiddleware, displayStoredFilesAndFolders);

// Show all shared files
router.get('/shared', authMiddleware, displaySharedFiles);

// Display all files that have been marked as deleted
router.get('/deleted', authMiddleware, displayDeletedFiles);

export default router;
