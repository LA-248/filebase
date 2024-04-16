import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { createNewUuid, deleteUuid, retrieveUuid } from '../controllers/uuid-handler-controller.mjs';

const router = express.Router();

router.post('/create-uuid/file/:name', authMiddleware, createNewUuid('files', 'fileName'));

router.post('/create-uuid/folder/:name', authMiddleware, createNewUuid('folders', 'folderName'));

router.post('/delete-uuid/file/:name', authMiddleware, deleteUuid('files', 'fileName'));

router.post('/delete-uuid/folder/:name', authMiddleware, deleteUuid('folders', 'folderName'));

router.get('/retrieve-uuid/file/:name', authMiddleware, retrieveUuid('files', 'fileName'));

router.get('/retrieve-uuid/folder/:name', authMiddleware, retrieveUuid('folders', 'folderName'));

export default router;
