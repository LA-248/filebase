import express from 'express';
import multer from 'multer';

// Middleware
import { authMiddleware } from '../middlewares/auth.mjs';

// Controllers
import { uploadFile, uploadFolder } from '../controllers/upload-controller.mjs';
import { addAsFavourite, removeAsFavourite } from '../controllers/favourites-controller.mjs';
import { markFileAsDeleted, restoreDeletedFile, permanentlyDeleteFile } from '../controllers/delete-file-controller.mjs';
import { previewFile } from '../controllers/preview-controller.mjs';
import { sendPresignedUrlForDownload } from '../controllers/download-controller.mjs';
import { viewSharedFile } from '../controllers/shared-file-controller.mjs';
import { fetchSharedStatus } from '../controllers/retrieve-shared-status-controller.mjs';
import { createNewUuid, deleteUuid, retrieveUuid } from '../controllers/uuid-handler-controller.mjs';
import { renameFile } from '../controllers/rename-controller.mjs';

const filesRouter = express.Router();

const upload = multer();

// Uploads
filesRouter.post('/', authMiddleware, upload.single('file'), uploadFile);
filesRouter.post('/multiple', authMiddleware, upload.array('files'), uploadFolder);

// Favourites
filesRouter.put('/:name/favourite', authMiddleware, addAsFavourite('files', 'fileName'));
filesRouter.delete('/:name/favourite', authMiddleware, removeAsFavourite('files', 'fileName'));

// Delete
filesRouter.delete('/:filename', authMiddleware, markFileAsDeleted);
filesRouter.put('/:filename/restore', authMiddleware, restoreDeletedFile);
filesRouter.delete('/:filename/permanent', authMiddleware, permanentlyDeleteFile);

// Preview
filesRouter.get('/:filename', authMiddleware, previewFile);

// Download
filesRouter.get('/:filename/download', authMiddleware, sendPresignedUrlForDownload);

// Share
filesRouter.get('/:uuid/share', viewSharedFile); // Doesn't work if 'share' is not appended to the route for a reason I haven't figured out yet
filesRouter.get('/:filename/users/:userId/', viewSharedFile); // View a file that exists in a shared folder
filesRouter.get('/:name/shared-status', authMiddleware, fetchSharedStatus('files', 'fileName'));

// Rename
filesRouter.put('/:name/rename', authMiddleware, renameFile);

// UUID
filesRouter.post('/:name/uuid', authMiddleware, createNewUuid('files', 'fileName'));
filesRouter.delete('/:name/uuid', authMiddleware, deleteUuid('files', 'fileName'));
filesRouter.get('/:name/uuid', authMiddleware, retrieveUuid('files', 'fileName'));

export default filesRouter;
