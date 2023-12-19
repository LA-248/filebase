import express from 'express';
import { retrieveFileData } from '../controllers/file-data-controller.mjs';

const router = express.Router();

// Preview a stored file
router.get('/preview/:filename', retrieveFileData);

export default router;
