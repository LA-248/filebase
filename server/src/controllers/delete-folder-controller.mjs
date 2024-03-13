import { db } from '../services/database.mjs';
import { promisify } from 'util';
import { deleteS3Object } from './delete-file-controller.mjs';

// Promisify the db.all and db.run methods
const dbAllAsync = promisify(db.all.bind(db));
const dbRunAsync = promisify(db.run.bind(db));

// Mark folder as deleted
const markFolderAsDeleted = async (req, res) => {
  const query = 'UPDATE folders SET deleted = ? WHERE folderName = ? AND userId = ?';

  const deleted = 'true';

  db.run(query, [deleted, req.params.foldername, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json('Folder marked as deleted.');
  });
}

// Restore a folder that was marked as deleted
const restoreDeletedFolder = async (req, res) => {
  const query = 'UPDATE folders SET deleted = ? WHERE folderName = ? AND userId = ?';

  const deleted = 'false';

  db.run(query, [deleted, req.params.foldername, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json('Folder restored.');
  });
}

// Delete folder contents from the database and S3
const permanentlyDeleteFolder = async (req, res) => {
  const retrieveFolderContents = 'SELECT f.fileName FROM files AS f WHERE f.folderName = ? AND f.userId = ?';
  const deleteFolder = 'DELETE FROM folders AS f WHERE f.folderName = ? AND f.userId = ?';
  const deleteFolderContents = 'DELETE FROM files AS f WHERE f.folderName = ? AND f.userId = ?';

  try {
    // Retrieve the contents of the folder from the database
    const folderContents = await dbAllAsync(retrieveFolderContents, [req.params.foldername, req.user.id]);

    // Delete the folder and its contents from the database
    await dbRunAsync(deleteFolder, [req.params.foldername, req.user.id]);
    await dbRunAsync(deleteFolderContents, [req.params.foldername, req.user.id]);
    console.log(`Database: Folder ${req.params.foldername} and its contents were successfully deleted.`);

    // Proceed to delete folder contents from S3 only if the database deletion succeeds
    for (let i = 0; i < folderContents.length; i++) {
      await deleteS3Object(folderContents[i].fileName);
    }

    console.log(`S3: Folder ${req.params.foldername} and its contents were successfully deleted.`);
    res.status(200).json(`Folder ${req.params.foldername} was successfully deleted.`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting folder.');
  }
};

export { markFolderAsDeleted, restoreDeletedFolder, permanentlyDeleteFolder };
