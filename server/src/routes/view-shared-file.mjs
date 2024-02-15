import express from 'express';
import { viewSharedFile } from '../controllers/view-shared-file-controller.mjs';

const router = express.Router();

// Preview a stored file
router.get('/share/:uuid', viewSharedFile);

export default router;
