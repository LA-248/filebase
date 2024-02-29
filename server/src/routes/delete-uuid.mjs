import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { deleteUuid } from '../controllers/uuid-handler-controller.mjs';

const router = express.Router();

router.get('/delete-uuid/:filename', authMiddleware, deleteUuid);

export default router;
