import express from 'express';
import { markFileAsDeleted, restoreDeletedFile, permanentlyDeleteFile } from '../controllers/delete-file-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Mark a file as deleted
router.delete('/files/:filename', authMiddleware, markFileAsDeleted);

// Restore a deleted file
router.put('/files/:filename/restore', authMiddleware, restoreDeletedFile);

// Permanently delete a file
/* 
:filename is a dynamic parameter that captures the name of the file to be deleted
The file name is sent from the frontend when the endpoint is hit
*/
router.delete('/files/:filename/permanent', authMiddleware, permanentlyDeleteFile);

export default router;
