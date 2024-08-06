import { Folder } from '../models/folder-model.mjs';

// Render the contents of a shared folder
export const displaySharedFolder = async (req, res) => {
  try {
    const folderUuid = req.params.uuid;
    const deleted = 'false';

    // Fetch the folder's name and the userId associated with it using the UUID
    const folder = await Folder.fetchFolderNameByUuid(folderUuid);

    // Check if the folder is null and folderName is undefined
    if (!folder || !folder.folderName) {
      res.status(404).render('pages/error.ejs', {
        title: 'Folder not found',
        errorDescription: 'It looks like you are trying to access a folder that does not exist',
      });
      return;
    }

    // Fetch the files in the shared folder if the folder name and user ID match
    const files = await Folder.fetchFilesInSharedFolder(folder.folderName,deleted,folder.userId);

    res.render('pages/shared-folder.ejs', {
      folderName: folder.folderName,
      uploadedFiles: files,
      userId: files.userId,
    });
  } catch (error) {
    console.error('Error processing files or rendering page:', error);
    return res.status(500).send('An error occurred when trying to render the page.');
  }
};
