import express from 'express';
import { displayPublicFolder } from '../controllers/public-folder-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

router.get('/public/:publicFolderId', displayPublicFolder);

export default router;
