import { db } from '../services/database.mjs';

// Render the contents of the public folder associated with a user
export const displayPublicFolder = async (req, res) => {
  const publicFolderId = req.params.publicFolderId;

  const fetchFiles = 'SELECT * FROM files AS f INNER JOIN users AS u ON f.userId = u.id WHERE u.publicFolderId = ? AND f.folderName = ? AND f.deleted = ?';
  db.all(fetchFiles, [publicFolderId, 'Public', 'false'], (err, files) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
      }

      try {
        // Render the public folder
        res.render('public-folder.ejs', {
          uploadedFiles: files,
          userId: files.userId,
        });
      } catch (error) {
        console.error('Error processing files or rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
      }
    }
  );
};
