import { db } from '../services/database.mjs';

export const addFileAsFavourite = (req, res) => {
  const query = 'UPDATE files SET isFavourite = "Yes" WHERE fileName = ? AND userId = ?';

  db.get(query, [req.params.filename, req.user.id], err => {
    if (err) {
      res.status(500).json('Database error.');
    } else {
      res.status(200).json('File successfully added to favourites.');
      console.log(`File ${req.params.filename} was successfully added to favourites.`);
    }
  });
};

export const removeFileAsFavourite = (req, res) => {
  const query = 'UPDATE files SET isFavourite = "No" WHERE fileName = ? AND userId = ?';

  db.get(query, [req.params.filename, req.user.id], err => {
    if (err) {
      res.status(500).json('Database error.');
    } else {
      // Get the URL path from query and send it back
      res.status(200).json(req.query.currentPath);
      console.log(req.query.currentPath);
      console.log(`File ${req.params.filename} was successfully removed from favourites.`);
    }
  });
};

export const displayFavourites = (req, res) => {
  const fetchFavourites = 'SELECT f.fileName FROM files AS f WHERE f.userId = ? AND f.isFavourite = ?';
  db.all(fetchFavourites, [req.user.id, 'Yes'], (err, files) => {
    if (err) {
      res.status(500).send('Database error:', err.message);
    }

    // Render the favourites page with all files
    res.render('favourites.ejs', {
      uploadedFiles: files,
      displayName: req.user.displayName,
    });
  });
};
