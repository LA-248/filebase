import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { fetchSharedStatus } from '../controllers/retrieve-shared-status-controller.mjs';

const router = express.Router();

router.get('/shared-status/file/:name', authMiddleware, fetchSharedStatus('files', 'fileName'));

router.get('/shared-status/folder/:name', authMiddleware, fetchSharedStatus('folders', 'folderName'));

export default router;
