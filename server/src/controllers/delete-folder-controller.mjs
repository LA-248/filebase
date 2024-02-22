import { db } from '../services/database.mjs';
import { promisify } from 'util';
import { deleteS3Object } from './delete-file-controller.mjs';

// Promisify the db.all and db.run methods
const dbAllAsync = promisify(db.all.bind(db));
const dbRunAsync = promisify(db.run.bind(db));

// Delete folder contents from the database and S3
const deleteFolder = async (req, res) => {
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
    res.status(500).json('Error deleting file.');
  }
};

export { deleteFolder };
