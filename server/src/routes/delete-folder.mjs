import express from 'express';
import { markFolderAsDeleted, permanentlyDeleteFolder, restoreDeletedFolder } from '../controllers/delete-folder-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Mark a file as deleted
router.post('/delete-folder/:foldername', authMiddleware, markFolderAsDeleted);

// Restore a deleted file
router.post('/restore-folder/:foldername', authMiddleware, restoreDeletedFolder);

// Permanently delete an uploaded folder
router.delete('/permanently-delete-folder/:foldername', authMiddleware, permanentlyDeleteFolder);

export default router;
