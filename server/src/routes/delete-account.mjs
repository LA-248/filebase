import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { deleteAccount } from '../controllers/delete-account-controller.mjs';

const router = express.Router();

router.delete('/account', authMiddleware, deleteAccount)

export default router;
