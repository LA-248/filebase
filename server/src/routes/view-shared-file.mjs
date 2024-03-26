import express from 'express';
import { viewSharedFile } from '../controllers/view-shared-file-controller.mjs';

const router = express.Router();

// Preview a shared file
router.get('/share/:uuid', viewSharedFile);

// Preview a file that exists in the Public folder
router.get('/u/:userId/:filename', viewSharedFile);

export default router;
