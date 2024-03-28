import { db } from "../services/database.mjs";

// Displays all shared files and folders in the Shared tab
export const displaySharedFiles = (req, res) => {
  // Retrieve all shared files
  const fetchSharedFiles = 'SELECT f.fileName, f.folderName, f.uuid FROM files AS f WHERE f.userId = ? AND f.shared = ? AND f.deleted = ?';
  db.all(fetchSharedFiles, [req.user.id, 'true', 'false'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    }

    // Retrieve all shared folders
    const fetchSharedFolders = 'SELECT f.folderName, f.uuid FROM folders AS f WHERE f.userId = ? AND f.shared = ? AND f.deleted = ?';
    db.all(fetchSharedFolders, [req.user.id, 'true', 'false'], (err, folders) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
      }

      try {
        // Render the page with all files and folders that have been shared
        res.render('shared.ejs', {
          uploadedFiles: files,
          uploadedFolders: folders,
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
