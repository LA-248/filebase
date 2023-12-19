import express from 'express';
import { retrieveFileData } from '../controllers/file-data-controller.mjs';

const router = express.Router();

// Download a stored file
router.get('/download/:filename', retrieveFileData);

export default router;
