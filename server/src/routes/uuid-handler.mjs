import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { createNewUuid, deleteUuid } from '../controllers/uuid-handler-controller.mjs';

const router = express.Router();

// Create uuid for files
router.post('/create-uuid/file/:name', authMiddleware, createNewUuid('files', 'fileName'));

// Create uuid for folders
router.post('/create-uuid/folder/:name', authMiddleware, createNewUuid('folders', 'folderName'));

// Delete uuid for files
router.post('/delete-uuid/file/:name', authMiddleware, deleteUuid('files', 'fileName'));

// Delete uuid for folders
router.post('/delete-uuid/folder/:name', authMiddleware, deleteUuid('folders', 'folderName'));

export default router;
