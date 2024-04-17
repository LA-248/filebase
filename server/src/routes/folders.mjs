import express from 'express';

// Middleware
import { authMiddleware } from '../middlewares/auth.mjs';

// Controllers
import { createFolder } from '../controllers/create-folder-controller.mjs';
import { displayFilesInFolder } from '../controllers/display-files-controller.mjs';
import { addAsFavourite, removeAsFavourite } from '../controllers/favourites-controller.mjs';
import { markFolderAsDeleted, restoreDeletedFolder, permanentlyDeleteFolder } from '../controllers/delete-folder-controller.mjs';
import { fetchSharedStatus } from '../controllers/retrieve-shared-status-controller.mjs';
import { displaySharedFolder } from '../controllers/shared-folder-controller.mjs';
import { createNewUuid, deleteUuid, retrieveUuid } from '../controllers/uuid-handler-controller.mjs';

const foldersRouter = express.Router();

// Create
foldersRouter.post('/', authMiddleware, createFolder);

// Display folder
foldersRouter.get('/:foldername', authMiddleware, displayFilesInFolder);

// Favourites
foldersRouter.put('/:name/favourite', authMiddleware, addAsFavourite('folders', 'folderName'));
foldersRouter.delete('/:name/favourite', authMiddleware, removeAsFavourite('folders', 'folderName'));

// Delete
foldersRouter.delete('/:foldername', authMiddleware, markFolderAsDeleted);
foldersRouter.put('/:foldername/restore', authMiddleware, restoreDeletedFolder);
foldersRouter.delete('/:foldername/permanent', authMiddleware, permanentlyDeleteFolder);

// Share
foldersRouter.get('/:uuid/share', displaySharedFolder); // Doesn't work if 'share' is not appended to the route for a reason I haven't figured out yet
foldersRouter.get('/:name/shared-status', authMiddleware, fetchSharedStatus('folders', 'folderName'));

// UUID
foldersRouter.post('/:name/uuid', authMiddleware, createNewUuid('folders', 'folderName'));
foldersRouter.delete('/:name/uuid', authMiddleware, deleteUuid('folders', 'folderName'));
foldersRouter.get('/:name/uuid', authMiddleware, retrieveUuid('folders', 'folderName'));

export default foldersRouter;
