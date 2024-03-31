import express from 'express';
import multer from 'multer';
import { uploadFile, uploadFolder } from '../controllers/upload-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

const upload = multer();

// Route to handle a single file upload
router.post('/upload-file', authMiddleware, upload.single('file'), uploadFile);

// Route to handle upload of the contents of a folder
router.post('/upload-folder', authMiddleware, upload.array('files'), uploadFolder);

export default router;
