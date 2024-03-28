import express from 'express';
import { viewSharedFile } from '../controllers/view-shared-file-controller.mjs';
import { displaySharedFolder } from '../controllers/shared-folder-controller.mjs';

const router = express.Router();

// Preview a shared file
router.get('/share/:uuid', viewSharedFile);

// Display a shared folder
router.get('/share-folder/:uuid', displaySharedFolder);

// Preview a file that exists in a shared folder
router.get('/u/:userId/:filename', viewSharedFile);

export default router;
