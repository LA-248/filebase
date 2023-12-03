import express from 'express';
import { uploadFile } from '../controllers/upload-controller.mjs';

const router = express.Router();

// Configures how uploaded files will be stored (destination and name)
import multer from 'multer';
const storage = multer.diskStorage({
  destination: '../uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Create a POST route to handle a single file upload and return a success message on the upload
router.post('/upload', upload.single('file'), uploadFile);

export default router;
