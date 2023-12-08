import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/upload-controller.mjs';

const router = express.Router();

// Configures how uploaded files will be stored
// File data is stored in memory as a buffer
const upload = multer({ storage: multer.memoryStorage() });

// Create a POST route to handle a single file upload and return a success message on the upload
router.post('/upload', upload.single('file'), uploadFile);

export default router;
