import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { displaySharedFiles } from '../controllers/shared-files-controller.mjs';


const router = express.Router();

// View all shared files
router.get('/shared', authMiddleware, displaySharedFiles);

export default router;
