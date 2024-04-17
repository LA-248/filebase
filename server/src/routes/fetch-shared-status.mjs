import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { fetchSharedStatus } from '../controllers/retrieve-shared-status-controller.mjs';

const router = express.Router();

router.get('/files/:name/shared-status', authMiddleware, fetchSharedStatus('files', 'fileName'));

router.get('/folders/:name/shared-status', authMiddleware, fetchSharedStatus('folders', 'folderName'));

export default router;
