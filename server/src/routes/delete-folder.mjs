import express from 'express';
import { deleteFolder } from '../controllers/delete-folder-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Delete a created folder
router.delete('/delete-folder/:foldername', authMiddleware, deleteFolder);

export default router;
