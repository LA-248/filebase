import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { addAsFavourite, removeAsFavourite, displayFavourites } from '../controllers/favourites-controller.mjs';

const router = express.Router();

// Add a file to favourites
router.post('/add-file-to-favourites/:name', authMiddleware, addAsFavourite('files', 'fileName'));

// Remove a file from favourites
router.delete('/remove-file-from-favourites/:name', authMiddleware, removeAsFavourite('files', 'fileName'));

// Add a folder to favourites
router.post('/add-folder-to-favourites/:name', authMiddleware, addAsFavourite('folders', 'folderName'));

// Remove a folder from favourites
router.delete('/remove-folder-from-favourites/:name', authMiddleware, removeAsFavourite('folders', 'folderName'));

// View all favourites
router.get('/favourites', authMiddleware, displayFavourites);

export default router;
