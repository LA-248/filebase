import { deleteS3Object } from './delete-file-controller.mjs';
import { updateFolderDeletionStatus } from '../models/folders/update.mjs';
import { retrieveFolderContents } from '../models/folders/fetch.mjs';
import { deleteFolder, deleteFolderContents } from '../models/folders/delete.mjs';

// Mark folder as deleted
const markFolderAsDeleted = async (req, res) => {
  try {
    const deleted = 'true';
    const folderName = req.params.foldername;
    const userId = req.user.id;

    await updateFolderDeletionStatus(deleted, folderName, userId);
    return res.status(200).json({ success: 'Folder marked as deleted.' });
  } catch (error) {
    console.error('Error deleting folder:', error.message);
    return res.status(500).json('Error deleting the folder. Please try again.');
  }
}

// Restore a folder that was marked as deleted
const restoreDeletedFolder = async (req, res) => {
  try {
    const deleted = 'false';
    const folderName = req.params.foldername;
    const userId = req.user.id;

    await updateFolderDeletionStatus(deleted, folderName, userId);
    return res.status(200).json({ success: 'Folder restored.' });
  } catch (error) {
    console.error('Error restoring folder:', error.message);
    return res.status(500).json('Error restoring the folder. Please try again.');
  }
}

// Delete folder contents from the database and S3
const permanentlyDeleteFolder = async (req, res) => {
  try {
    const folderName = req.params.foldername;
    const userId = req.user.id;

    // Retrieve the contents of the folder from the database
    const folderContents = await retrieveFolderContents(folderName, userId);

    // Delete the folder and its contents from the database
    await deleteFolder(folderName, userId);
    await deleteFolderContents(folderName, userId);
    console.log(`Database: Folder ${folderName} and its contents were successfully deleted.`);

    // Proceed to delete folder contents from S3 only if the database deletion succeeds
    for (let i = 0; i < folderContents.length; i++) {
      await deleteS3Object(folderContents[i].fileName);
    }

    console.log(`S3: Folder ${folderName} and its contents were successfully deleted.`);
    res.status(200).json({ success: `Folder ${folderName} was successfully deleted.` });
  } catch (error) {
    console.error('Error permanently deleting folder:', error);
    return res.status(500).send('Error deleting folder.');
  }
};

export { markFolderAsDeleted, restoreDeletedFolder, permanentlyDeleteFolder };
