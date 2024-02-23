import { db } from '../services/database.mjs';

// Check database to see if file has been added to favourites, and set favouriteButtonText accordingly
function setFavouriteButtonText(rows) {
  rows.forEach((row) => {
    if (row.isFavourite === 'No') {
      row.favouriteButtonText = 'Add to favourites';
    } else {
      row.favouriteButtonText = 'Remove from favourites';
    }
  });
}

// Retrieve files and folders associated with respective user from the database and display them
export const displayStoredFilesAndFolders = (req, res) => {
  // Fetches all columns from the files table where the userId column matches a specific user ID
  const fetchFiles = 'SELECT * FROM files AS f WHERE f.userId = ? AND f.folderName = ?';
  // The 'rows' variable is used to store the result set returned by the database query
  db.all(fetchFiles, [req.user.id, 'not-in-folder'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    }

    // Fetch all folders associated with a user
    const fetchFolders = 'SELECT f.folderName FROM folders AS f WHERE f.userId = ?';
    db.all(fetchFolders, [req.user.id], (err, folders) => {
      if (err) {
        res.status(500).send('An unexpected error occurred.');
      }

      try {
        setFavouriteButtonText(files);

        // Render the home page with file and folder information
        res.render('home.ejs', {
          uploadedFiles: files,
          uploadedFolders: folders,
          uuid: files.uuid,
          displayName: req.user.displayName,
        });
      } catch (error) {
        console.error('Error processing files or rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
      }
    });
  });
};

export const displayFilesInFolder = (req, res) => {
  const fetchFiles = 'SELECT * FROM files AS f WHERE f.userId = ? AND f.folderName = ?';
  db.all(fetchFiles, [req.user.id, req.params.foldername], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    }

    try {
      setFavouriteButtonText(files);

      // Render the folder page with all files
      res.render('folder.ejs', {
        uploadedFiles: files,
        folderName: req.params.foldername,
        displayName: req.user.displayName,
      });
    } catch (error) {
      console.error('Error processing files or rendering page:', error.message);
      res.status(500).send('An error occurred when trying to render the page.');
    }
  });
};
