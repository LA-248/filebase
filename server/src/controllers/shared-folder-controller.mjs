import { db } from '../services/database.mjs';

// Render the contents of a shared folder
export const displaySharedFolder = async (req, res) => {
  const folderUuid = req.params.uuid;
  
  // Query to fetch the folder's name and the userId associated with it using the UUID
  const fetchFolderName = 'SELECT folderName, userId FROM folders WHERE uuid = ?';
  db.get(fetchFolderName, [folderUuid], (err, folder) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    }

    // Check if the folder is null and folderName is undefined
    if (!folder || !folder.folderName) {
      res.status(404).render('error.ejs', {
        title: 'Folder not found',
        errorDescription:
          'It looks like you are trying to access a folder that does not exist',
      });
      return;
    }

    // Fetch and render the files in the shared folder if the folder names and the user IDs match
    const fetchFiles = 'SELECT f.fileName, f.userId, u.id FROM files AS f INNER JOIN users AS u ON f.userId = u.id WHERE f.folderName = ? AND f.deleted = ? AND f.userId = ?';

    db.all(fetchFiles, [folder.folderName, 'false', folder.userId], (err, files) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
      }

      try {
        res.render('shared-folder.ejs', {
          folderName: folder.folderName,
          uploadedFiles: files,
          userId: files.userId,
        });
      } catch (error) {
        console.error('Error processing files or rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
      }
    });
  });
};
