import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { createNewUuid, deleteUuid, retrieveUuid } from '../controllers/uuid-handler-controller.mjs';

const router = express.Router();

router.post('/files/:name/uuid', authMiddleware, createNewUuid('files', 'fileName'));

router.post('/folders/:name/uuid', authMiddleware, createNewUuid('folders', 'folderName'));

router.delete('/files/:name/uuid', authMiddleware, deleteUuid('files', 'fileName'));

router.delete('/folders/:name/uuid', authMiddleware, deleteUuid('folders', 'folderName'));

router.get('/files/:name/uuid', authMiddleware, retrieveUuid('files', 'fileName'));

router.get('/folders/:name/uuid', authMiddleware, retrieveUuid('folders', 'folderName'));

export default router;
