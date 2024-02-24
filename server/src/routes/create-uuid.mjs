import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { createNewUuid } from '../controllers/create-uuid-controller.mjs';

const router = express.Router();

router.get('/create-uuid/:filename', authMiddleware, createNewUuid);

export default router;
