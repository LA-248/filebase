import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { addFileAsFavourite, removeAsFavourite, displayFavourites } from '../controllers/favourites-controller.mjs';

const router = express.Router();

// Add a file to favourites
router.get('/add-to-favourites/:filename', authMiddleware, addFileAsFavourite);

// Remove a file from favourites
router.delete('/remove-from-favourites/:filename', authMiddleware, removeAsFavourite);

// View all files in favourites
router.get('/favourites', authMiddleware, displayFavourites);

export default router;
