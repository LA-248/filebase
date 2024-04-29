import express from 'express';
import {
  displayStoredFilesAndFolders,
  displaySharedFiles,
  displayDeletedFiles,
  displaySizesOfAllFiles,
} from '../controllers/display-files-controller.mjs';
import { displayFavourites } from '../controllers/favourites-controller.mjs';
import { retrieveTotalUsedStoragePerUser } from '../controllers/total-used-storage-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const navigationRouter = express.Router();

// Home
navigationRouter.get('/home', authMiddleware, displayStoredFilesAndFolders);

// Favourites
navigationRouter.get('/favourites', authMiddleware, displayFavourites);

// Shared
navigationRouter.get('/shared', authMiddleware, displaySharedFiles);

// Deleted
navigationRouter.get('/deleted', authMiddleware, displayDeletedFiles);

// Storage
navigationRouter.get('/storage', authMiddleware, displaySizesOfAllFiles);

// Settings
navigationRouter.get('/settings', authMiddleware, async (req, res) => {
  const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

  res.render('settings.ejs', {
    displayName: req.user.displayName,
    totalUsedStorage: totalUsedStorage,
  });
});

export default navigationRouter;
