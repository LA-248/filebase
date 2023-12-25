import express from 'express';
import { displayStoredFiles } from '../controllers/display-files-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

router.get('/home', authMiddleware, displayStoredFiles);

export default router;
