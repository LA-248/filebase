import express from 'express';
import multer from 'multer';
import { uploadFile, uploadFolder } from '../controllers/upload-controller.mjs';

const router = express.Router();

// Stores all uploaded files in memory as buffer objects
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle a single file upload
router.post('/upload-file', upload.single('file'), uploadFile);

// Route to handle upload of files within a folder - max of 10 files can be uploaded at once
router.post('/upload-folder', upload.array('files', 10), uploadFolder);

export default router;
