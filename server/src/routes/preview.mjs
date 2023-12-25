import express from 'express';
import { retrieveFileData } from '../controllers/file-data-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Preview a stored file
router.get('/preview/:filename', authMiddleware, retrieveFileData);

export default router;
