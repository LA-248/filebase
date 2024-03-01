import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { createNewUuid } from '../controllers/uuid-handler-controller.mjs';

const router = express.Router();

router.post('/create-uuid/:filename', authMiddleware, createNewUuid);

export default router;
