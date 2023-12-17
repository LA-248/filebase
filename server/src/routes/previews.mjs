import express from 'express';
import { previewFile } from '../controllers/previews-controller.mjs';

const router = express.Router();

router.get('/preview/:filename', previewFile);

export default router;
