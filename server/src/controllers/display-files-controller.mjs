import { db } from '../services/database.mjs';
import { retrieveTotalUsedStoragePerUser } from './total-used-storage-controller.mjs';

// Check database to see if file/folder has been added to favourites, and set favouriteButtonText accordingly
function setFavouriteButtonText(rows) {
  rows.forEach((row) => {
    if (row.isFavourite === 'false') {
      row.favouriteButtonText = 'Add to favourites';
    } else {
      row.favouriteButtonText = 'Remove from favourites';
    }
  });
}

// FOR HOMEPAGE -- Retrieve files and folders associated with respective user from the database and display them
const displayStoredFilesAndFolders = (req, res) => {
  // Fetches all columns from the files table where the userId column matches a specific user ID
  const fetchFiles = 'SELECT * FROM files AS f WHERE f.userId = ? AND f.folderName = ? AND f.deleted = ?';
  // The 'rows' variable is used to store the result set returned by the database query
  db.all(fetchFiles, [req.user.id, 'not-in-folder', 'false'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    // Fetch all folders associated with a user that have been created on the home page
    const fetchFolders = 'SELECT * FROM folders AS f WHERE f.userId = ? AND f.parentFolder = ? AND f.deleted = ?';
    db.all(fetchFolders, [req.user.id, 'not-in-folder', 'false'], async (err, folders) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
        return;
      }

      try {
        setFavouriteButtonText(files);
        setFavouriteButtonText(folders);

        const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

        // Render the home page with file and folder information
        res.render('pages/home.ejs', {
          uploadedFiles: files,
          uploadedFolders: folders,
          fileUuid: files.uuid,
          folderUuid: folders.uuid,
          totalUsedStorage: totalUsedStorage,
          currentPage: 'home',
        });
      } catch (error) {
        console.error('Error processing files or rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
        return;
      }
    });
  });
};

// Retrieve all files and folders that exist within a folder and display them
const displayFilesInFolder = (req, res) => {
  const fetchFiles = 'SELECT * FROM files AS f WHERE f.userId = ? AND f.folderName = ? AND f.deleted = ?';
  db.all(fetchFiles, [req.user.id, req.params.foldername, 'false'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    // Fetch the folders that have been uploaded inside of certain other folder
    const fetchFolders = 'SELECT * FROM folders AS f WHERE f.userId = ? AND f.parentFolder = ? AND f.deleted = ?';
    db.all(fetchFolders, [req.user.id, req.params.foldername, 'false'], async (err, folders) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
        return;
      }

      try {
        setFavouriteButtonText(files);
        setFavouriteButtonText(folders);

        const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

        // Render the respective folder with all of its files and folders
        res.render('pages/folder.ejs', {
          uploadedFiles: files,
          uploadedFolders: folders,
          folderName: req.params.foldername,
          fileUuid: files.uuid,
          folderUuid: folders.uuid,
          totalUsedStorage: totalUsedStorage,
          currentPage: 'home',
        });
      } catch (error) {
        console.error('Error processing files or rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
        return;
      }
    });
  });
};

// Displays all shared files and folders in the Shared tab
const displaySharedFiles = (req, res) => {
  // Retrieve all shared files
  const fetchSharedFiles = 'SELECT f.fileName, f.folderName, f.uuid FROM files AS f WHERE f.userId = ? AND f.shared = ? AND f.deleted = ?';
  db.all(fetchSharedFiles, [req.user.id, 'true', 'false'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    // Retrieve all shared folders
    const fetchSharedFolders = 'SELECT f.folderName, f.parentFolder, f.uuid FROM folders AS f WHERE f.userId = ? AND f.shared = ? AND f.deleted = ?';
    db.all(fetchSharedFolders, [req.user.id, 'true', 'false'], async (err, folders) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
        return;
      }

      try {
        const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

        // Render the page with all files and folders that have been shared
        res.render('pages/shared.ejs', {
          uploadedFiles: files,
          uploadedFolders: folders,
          parentFolder: folders.parentFolder,
          folderName: files.folderName,
          fileUuid: files.uuid,
          folderUuid: folders.uuid,
          totalUsedStorage: totalUsedStorage,
          currentPage: 'shared',
        });
      } catch (error) {
        console.error('Error rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
      }
    });
  });
};

// Displays all files and folders that have been marked as deleted
const displayDeletedFiles = (req, res) => {
  const fetchDeletedFiles = 'SELECT f.fileName, f.folderName FROM files AS f WHERE f.userId = ? AND f.deleted = ?';
  db.all(fetchDeletedFiles, [req.user.id, 'true'], (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    const fetchDeletedFolders = 'SELECT f.folderName, f.parentFolder FROM folders AS f WHERE f.userId = ? AND f.deleted = ?';
    db.all(fetchDeletedFolders, [req.user.id, 'true'], async (err, folders) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('An unexpected error occurred.');
        return;
      }

      try {
        const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

        // Render the page with all files and folders that have been marked as deleted
        res.render('pages/deleted-files.ejs', {
          uploadedFiles: files,
          uploadedFolders: folders,
          parentFolder: folders.parentFolder,
          folderName: files.folderName,
          totalUsedStorage: totalUsedStorage,
          currentPage: 'deleted',
        });
      } catch (error) {
        console.error('Error rendering page:', error.message);
        res.status(500).send('An error occurred when trying to render the page.');
        return;
      }
    });
  });
};

// Retrieve and display the size of each file uploaded by a user - so the space each file takes up can be tracked
const displaySizesOfAllFiles = (req, res) => {
  const query = 'SELECT f.fileName, f.folderName, f.fileSize, f.uuid FROM files AS f WHERE f.userId = ?';

  db.all(query, [req.user.id], async (err, files) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    }

    try {
      // Need to retrieve the total used storage to display it on the 'Storage' page
      const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

      // Sort file sizes from biggest to smallest
      files.sort((a, b) => {
        return b.fileSize - a.fileSize;
      });

      res.render('pages/storage.ejs', {
        uploadedFiles: files,
        totalUsedStorage: totalUsedStorage,
        currentPage: 'storage',
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('An error occurred when trying to render the page.');
    }
  });
};

export {
  displayStoredFilesAndFolders,
  displayFilesInFolder,
  displaySharedFiles,
  displayDeletedFiles,
  displaySizesOfAllFiles,
};
