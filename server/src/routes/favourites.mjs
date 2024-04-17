import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { addAsFavourite, removeAsFavourite, displayFavourites } from '../controllers/favourites-controller.mjs';

const router = express.Router();

router.put('/files/:name/favourite', authMiddleware, addAsFavourite('files', 'fileName'));

router.delete('/files/:name/favourite', authMiddleware, removeAsFavourite('files', 'fileName'));

router.put('/folders/:name/favourite', authMiddleware, addAsFavourite('folders', 'folderName'));

router.delete('/folders/:name/favourite', authMiddleware, removeAsFavourite('folders', 'folderName'));

// View all favourites
router.get('/favourites', authMiddleware, displayFavourites);

export default router;
