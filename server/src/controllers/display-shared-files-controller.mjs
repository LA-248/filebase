import { db } from "../services/database.mjs";

export const displaySharedFiles = (req, res) => {
  const fetchSharedFiles = 'SELECT f.fileName, f.folderName, f.uuid FROM files AS f WHERE f.userId = ? AND f.shared = ?';

  db.all(fetchSharedFiles, [req.user.id, 'true'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    }

    try {
      // Render the page with all files that have been shared
      res.render('shared-files.ejs', {
        uploadedFiles: files,
        folderName: files.folderName,
        uuid: files.uuid,
        displayName: req.user.displayName,
      });
    } catch (error) {
      console.error('Error rendering page:', error.message);
      res.status(500).send('An error occurred when trying to render the page.');
    }
  });
};
