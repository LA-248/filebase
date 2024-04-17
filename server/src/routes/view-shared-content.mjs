import express from 'express';
import { viewSharedFile } from '../controllers/shared-file-controller.mjs';
import { displaySharedFolder } from '../controllers/shared-folder-controller.mjs';

const router = express.Router();

// Preview a shared file
router.get('/files/:uuid', viewSharedFile);

// Display a shared folder
router.get('/folders/:uuid', displaySharedFolder);

// Preview a file that exists in a shared folder
router.get('/users/:userId/files/:filename', viewSharedFile);

export default router;
