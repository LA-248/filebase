import { db } from '../services/database.mjs';
import { retrieveTotalUsedStoragePerUser } from './total-used-storage-controller.mjs';

export const addAsFavourite = (table, column) => (req, res) => {
  const query = `UPDATE ${table} SET isFavourite = ? WHERE ${column} = ? AND userId = ?`;

  db.run(query, ['true', req.params.name, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    } else {
      res.status(200).json(`${req.params.name} was successfully added to favourites.`);
      console.log(`${req.params.name} was successfully added to favourites.`);
    }
  });
};

export const removeAsFavourite = (table, column) => (req, res) => {
  const query = `UPDATE ${table} SET isFavourite = ? WHERE ${column} = ? AND userId = ?`;

  db.run(query, ['false', req.params.name, req.user.id], (err) => {
    if (err) {
      res.status(500).send('An unexpected error occurred.');
      return;
    } else {
      // Get the URL path from query and send it back
      res.status(200).json(req.query.currentPath);
      console.log(`${req.params.name} was successfully removed from favourites.`);
    }
  });
};

// Display all files/folders that have been favourited
export const displayFavourites = (req, res) => {
  const fetchFileFavourites = 'SELECT f.fileName, f.folderName, f.uuid FROM files AS f WHERE f.userId = ? AND f.isFavourite = ? AND f.deleted = ?';
  db.all(fetchFileFavourites, [req.user.id, 'true', 'false'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    const fetchFolderFavourites = 'SELECT f.folderName, f.parentFolder, f.uuid FROM folders AS f WHERE f.userId = ? AND f.isFavourite = ? AND f.deleted = ?';
    db.all(fetchFolderFavourites, [req.user.id, 'true', 'false'], async (err, folders) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
        return;
      }

      try {
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
    });
  });
};
