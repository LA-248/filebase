import express from 'express';
import { displayStoredFilesAndFolders, displaySharedFiles, displayDeletedFiles } from '../controllers/display-files-controller.mjs';
import { displayFavourites } from '../controllers/favourites-controller.mjs';
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

// Settings
navigationRouter.get('/settings', authMiddleware, (req, res) => {
  res.render('settings.ejs', {
    displayName: req.user.displayName,
  });
});

export default navigationRouter;
