import { db } from '../services/database.mjs';

export const addAsFavourite = (table, column) => (req, res) => {
  const query = `UPDATE ${table} SET isFavourite = "true" WHERE ${column} = ? AND userId = ?`;

  db.run(query, [req.params.name, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    } else {
      res.status(200).json('File successfully added to favourites.');
      console.log(
        `${req.params.name} was successfully added to favourites.`
      );
    }
  });
};

export const removeAsFavourite = (table, column) => (req, res) => {
  const query = `UPDATE ${table} SET isFavourite = "false" WHERE ${column} = ? AND userId = ?`;

  db.get(query, [req.params.name, req.user.id], (err) => {
    if (err) {
      res.status(500).send('An unexpected error occurred.');
    } else {
      // Get the URL path from query and send it back
      res.status(200).json(req.query.currentPath);
      console.log(req.query.currentPath);
      console.log(
        `${req.params.name} was successfully removed from favourites.`
      );
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
    }

    const fetchFolderFavourites = 'SELECT f.folderName, f.currentFolder FROM folders AS f WHERE f.userId = ? AND f.isFavourite = ? AND f.deleted = ?';
    db.all(fetchFolderFavourites, [req.user.id, 'true', 'false'], (err, folders) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
      }

      try {
        // Render the favourites page
        res.render('favourites.ejs', {
          uploadedFiles: files,
          uploadedFolders: folders,
          currentFolder: folders.currentFolder,
          folderName: files.folderName,
          uuid: files.uuid,
          displayName: req.user.displayName,
        });
      } catch (error) {
        console.error('Error rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
      }
    });
  });
};
