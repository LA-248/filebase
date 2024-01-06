import express from 'express';
import { createFolder } from '../controllers/create-folder-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

router.post('/create-folder', authMiddleware, createFolder);

export default router;
