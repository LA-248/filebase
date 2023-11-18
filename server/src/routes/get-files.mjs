import express from 'express';
import { getStoredFiles } from '../controllers/getFilesController.mjs';

const router = express.Router();

router.get('/getFiles', getStoredFiles);

export default router;
