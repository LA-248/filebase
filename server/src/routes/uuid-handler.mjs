import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { createNewUuid, deleteUuid } from '../controllers/uuid-handler-controller.mjs';

const router = express.Router();

// Create uuid for files
router.post('/create-file-uuid/:name', authMiddleware, createNewUuid('files', 'fileName'));

// Create uuid for folders
router.post('/create-folder-uuid/:name', authMiddleware, createNewUuid('folders', 'folderName'));

// Delete uuid for files
router.post('/delete-file-uuid/:name', authMiddleware, deleteUuid('files', 'fileName'));

// Delete uuid for folders
router.post('/delete-folder-uuid/:name', authMiddleware, deleteUuid('folders', 'folderName'));

export default router;
