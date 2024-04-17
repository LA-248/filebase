import express from 'express';
import { markFolderAsDeleted, permanentlyDeleteFolder, restoreDeletedFolder } from '../controllers/delete-folder-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Mark a file as deleted
router.delete('/folders/:foldername', authMiddleware, markFolderAsDeleted);

// Restore a deleted file
router.put('/folders/:foldername/restore', authMiddleware, restoreDeletedFolder);

// Permanently delete an uploaded folder
router.delete('/folders/:foldername/permanent', authMiddleware, permanentlyDeleteFolder);

export default router;
