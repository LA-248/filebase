import { fetchFavouritedFiles } from '../models/files/fetch.mjs';
import { updateFavouritedStatus } from '../models/files/update.mjs';
import { fetchFavouritedFolders } from '../models/folders/fetch.mjs';
import { retrieveTotalUsedStoragePerUser } from './total-used-storage-controller.mjs';

export const addAsFavourite = (table, column) => async (req, res) => {
  try {
    const favourited = 'true';
    const itemName = req.params.name;
    const userId = req.user.id;

    // Update the database with the new favourite status
    await updateFavouritedStatus(table, column, favourited, itemName, userId);
    return res.status(200).json({ success: `${itemName} was successfully added to favourites.` });
  } catch (error) {
    console.error('Error adding as favourite:', error);
    return res.status(500).json({ message: 'Error adding as favourite. Please try again.' });
  }
};

export const removeAsFavourite = (table, column) => async (req, res) => {
  try {
    const favourited = 'false';
    const itemName = req.params.name;
    const userId = req.user.id;

    await updateFavouritedStatus(table, column, favourited, itemName, userId);
    return res.status(200).json({ success: `${itemName} was successfully removed from favourites.` });
  } catch (error) {
    console.error('Error removing as favourite:', error);
    return res.status(500).json({ message: 'Error removing as favourite. Please try again.' });
  }
};

// Display all files/folders that have been favourited
export const displayFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    const isFavourite = 'true';
    const deleted = 'false';

    // Fetch all favourited files and folders from the database
    const files = await fetchFavouritedFiles(userId, isFavourite, deleted);
    const folders = await fetchFavouritedFolders(userId, isFavourite, deleted);

    // Get total storage used
    const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

    // Render the favourites page
    res.render('pages/favourites.ejs', {
      uploadedFiles: files,
      uploadedFolders: folders,
      parentFolder: folders.parentFolder,
      folderName: files.folderName,
      fileUuid: files.uuid,
      folderUuid: folders.uuid,
      totalUsedStorage: totalUsedStorage,
      currentPage: 'favourites',
    });
  } catch (error) {
    console.error('Error rendering page:', error.message);
    res.status(500).send('An error occurred when trying to render the page.');
  }
};
