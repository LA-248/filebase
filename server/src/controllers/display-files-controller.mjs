import { db } from '../services/database.mjs';

// Check database to see if file has been added to favourites, and set favouriteButtonText accordingly
function setFavouriteButtonText(rows) {
  rows.forEach((row) => {
    if (row.isFavourite === 'false') {
      row.favouriteButtonText = 'Add to favourites';
    } else {
      row.favouriteButtonText = 'Remove from favourites';
    }
  });
}

// Retrieve files and folders associated with respective user from the database and display them
const displayStoredFilesAndFolders = (req, res) => {
  // Fetches all columns from the files table where the userId column matches a specific user ID
  const fetchFiles = 'SELECT * FROM files AS f WHERE f.userId = ? AND f.folderName = ? AND f.deleted = ?';
  // The 'rows' variable is used to store the result set returned by the database query
  db.all(fetchFiles, [req.user.id, 'not-in-folder', 'false'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    }

    // Fetch all folders associated with a user
    const fetchFolders = 'SELECT * FROM folders AS f WHERE f.userId = ? AND f.deleted = ?';
    db.all(fetchFolders, [req.user.id, 'false'], (err, folders) => {
      if (err) {
        res.status(500).send('An unexpected error occurred.');
      }

      // Set the publicFolderId for the user's Public folder
      const fetchPublicFolderId = 'SELECT u.publicFolderId FROM users AS u WHERE u.id = ?';
      db.get(fetchPublicFolderId, [req.user.id], (err, row) => {
        if (err) {
          res.status(500).send('An unexpected error occurred.');
        }

        try {
          setFavouriteButtonText(files);
          setFavouriteButtonText(folders);

          // Render the home page with file and folder information
          res.render('home.ejs', {
            uploadedFiles: files,
            uploadedFolders: folders,
            publicFolderId: row.publicFolderId,
            uuid: files.uuid,
            displayName: req.user.displayName,
          });
        } catch (error) {
          console.error('Error processing files or rendering page:', error.message);
          res.status(500).send('An error occurred when trying to render the page.');
        }
      });
    });
  });
};

// Retrieve all files that exist within a folder and display them
const displayFilesInFolder = (req, res) => {
  const fetchFiles = 'SELECT * FROM files AS f WHERE f.userId = ? AND f.folderName = ? AND f.deleted = ?';

  db.all(
    fetchFiles,
    [req.user.id, req.params.foldername, 'false'],
    (err, files) => {
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
          uuid: files.uuid,
          displayName: req.user.displayName,
        });
      } catch (error) {
        console.error('Error processing files or rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
      }
    }
  );
};

// Displays all files and folders that have been marked as deleted
const displayDeletedFiles = async (req, res) => {
  const fetchDeletedFiles = 'SELECT f.fileName, f.folderName FROM files AS f WHERE f.userId = ? AND f.deleted = ?';
  db.all(fetchDeletedFiles, [req.user.id, 'true'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    }

    const fetchDeletedFolders = 'SELECT f.folderName FROM folders AS f WHERE f.userId = ? AND f.deleted = ?';
    db.all(fetchDeletedFolders, [req.user.id, 'true'], (err, folders) => {
      if (err) {
        res.status(500).send('An unexpected error occurred.');
      }

      try {
        // Render the page with all files and folders that have been marked as deleted
        res.render('deleted-files.ejs', {
          uploadedFiles: files,
          uploadedFolders: folders,
          folderName: files.folderName,
          uuid: null,
          displayName: req.user.displayName,
        });
      } catch (error) {
        console.error('Error rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
      }
    });
  });
};

export {
  displayStoredFilesAndFolders,
  displayFilesInFolder,
  displayDeletedFiles,
};
