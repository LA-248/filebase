import { db } from '../services/database.mjs';

// Retrieve files associated with respective user from the database and display them
export const displayStoredFiles = (req, res) => {
  // Fetches all columns from the files table where the userId column matches a specific user ID
  const fetchFiles = 'SELECT f.fileName FROM files AS f WHERE f.userId = ?';
  // The 'rows' variable is used to store the result set returned by the database query
  db.all(fetchFiles, [req.user.id], (err, files) => {
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
  const fetchFiles = 'SELECT f.fileInformation FROM folders AS f WHERE f.userId = ?';
  db.all(fetchFiles, [req.user.id], (err, files) => {
    if (err) {
      res.status(500).send('Database error:', err.message);
    }

    // Retrieve information of all files that exist within the folder
    const parsedFiles = files.map((file) => {
      // Convert the JSON string to an object
      let fileInformation = JSON.parse(file.fileInformation);

      // If 'fileInformation' is an array, return the first object in the array
      if (Array.isArray(fileInformation)) {
        return fileInformation[0];
      }

      return {};
    });

    // Render the folder page with all files
    res.render('folder.ejs', {
      uploadedFiles: parsedFiles,
      folderName: req.params.foldername,
      displayName: req.user.displayName,
    });
  });
};
