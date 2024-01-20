import { db } from '../services/database.mjs';

// Retrieve files associated with respective user from the database and display them
export const displayStoredFiles = (req, res) => {
  // Fetches all columns from the files table where the userId column matches a specific user ID
  const fetchFiles = 'SELECT f.fileName FROM files AS f WHERE f.userId = ? AND f.folderName = ?';
  // The 'rows' variable is used to store the result set returned by the database query
  db.all(fetchFiles, [req.user.id, 'not-in-folder'], (err, files) => {
    if (err) {
      res.status(500).send('Database error:', err.message);
    }

    // Fetch all folders associated with a user
    const fetchFolders = 'SELECT f.folderName FROM folders AS f WHERE f.userId = ?';
    db.all(fetchFolders, [req.user.id], (err, folders) => {
      if (err) {
        res.status(500).send('Database error:', err.message);
      }

      // Render the home page with file information
      res.render('home.ejs', {
        uploadedFiles: files,
        uploadedFolders: folders,
        displayName: req.user.displayName,
      });
    });
  });
};

export const displayFilesInFolder = (req, res) => {
  const fetchFiles = 'SELECT f.fileName FROM files AS f WHERE f.userId = ? AND f.folderName = ?';
  db.all(fetchFiles, [req.user.id, req.params.foldername], (err, files) => {
    if (err) {
      res.status(500).send('Database error:', err.message);
    }

    // Render the folder page with all files
    res.render('folder.ejs', {
      uploadedFiles: files,
      folderName: req.params.foldername,
      displayName: req.user.displayName,
    });
  });
};
