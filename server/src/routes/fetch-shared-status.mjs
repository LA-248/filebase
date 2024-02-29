import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { fetchSharedStatus } from '../controllers/retrieve-shared-status.mjs';

const router = express.Router();

router.get('/fetch-shared-status/:filename', authMiddleware, fetchSharedStatus);

export default router;
