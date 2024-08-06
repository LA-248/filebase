import setFavouriteButtonText from '../utils/favourite-button-manager.mjs';
import { File } from '../models/file-model.mjs';
import { Folder } from '../models/folder-model.mjs';
import { retrieveTotalUsedStoragePerUser } from './total-used-storage-controller.mjs';

// FOR HOMEPAGE -- Retrieve files and folders associated with the respective user from the database and display them
const displayStoredFilesAndFolders = async (req, res) => {
  try {
    const userId = req.user.id;
    const parentFolder = 'not-in-folder'; // Ensures we only get root level files and folders
    const deleted = 'false';

    const files = await File.fetchAllStoredFiles(userId, parentFolder, deleted);
    const folders = await Folder.fetchAllStoredFolders(userId, parentFolder, deleted);

    setFavouriteButtonText(files);
    setFavouriteButtonText(folders);

    const totalUsedStorage = await retrieveTotalUsedStoragePerUser(userId);

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
    console.error('Error processing files or rendering page:', error);
    return res.status(500).send('An error occurred when trying to render the page.');
  }
};

// Retrieve all files and folders that exist within a folder and display them
const displayFilesInFolder = async (req, res) => {
  try {
    const userId = req.user.id;
    const parentFolder = req.params.foldername; // Ensures we only get sub files and folders
    const deleted = 'false';

    const subFiles = await File.fetchAllStoredFiles(userId, parentFolder, deleted);
    const subFolders = await Folder.fetchAllStoredFolders(userId,parentFolder,deleted);

    setFavouriteButtonText(subFiles);
    setFavouriteButtonText(subFolders);

    const totalUsedStorage = await retrieveTotalUsedStoragePerUser(userId);

    // Render the respective folder with all of its files and folders
    res.render('pages/folder.ejs', {
      uploadedFiles: subFiles,
      uploadedFolders: subFolders,
      folderName: parentFolder,
      fileUuid: subFiles.uuid,
      folderUuid: subFolders.uuid,
      totalUsedStorage: totalUsedStorage,
      currentPage: 'home',
    });
  } catch (error) {
    console.error('Error processing files or rendering page:', error);
    return res.status(500).send('An error occurred when trying to render the page.');
  }
};

// Displays all shared files and folders in the Shared tab
const displaySharedFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const shared = 'true';
    const deleted = 'false';

    const sharedFiles = await File.fetchAllSharedFiles(userId, shared, deleted);
    const sharedFolders = await Folder.fetchAllSharedFolders(userId, shared, deleted);

    const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

    // Render the page with all files and folders that have been shared
    res.render('pages/shared.ejs', {
      uploadedFiles: sharedFiles,
      uploadedFolders: sharedFolders,
      parentFolder: sharedFolders.parentFolder,
      folderName: sharedFiles.folderName,
      fileUuid: sharedFiles.uuid,
      folderUuid: sharedFolders.uuid,
      totalUsedStorage: totalUsedStorage,
      currentPage: 'shared',
    });
  } catch (error) {
    console.error('Error rendering page:', error);
    return res.status(500).send('An error occurred when trying to render the page.');
  }
};

// Displays all files and folders that have been marked as deleted
const displayDeletedFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = 'true';

    const deletedFiles = await File.fetchAllDeletedFiles(userId, deleted);
    const deletedFolders = await Folder.fetchAllDeletedFolders(userId, deleted);

    const totalUsedStorage = await retrieveTotalUsedStoragePerUser(req.user.id);

    // Render the page with all files and folders that have been marked as deleted
    res.render('pages/deleted-files.ejs', {
      uploadedFiles: deletedFiles,
      uploadedFolders: deletedFolders,
      parentFolder: deletedFolders.parentFolder,
      folderName: deletedFiles.folderName,
      totalUsedStorage: totalUsedStorage,
      currentPage: 'deleted',
    });
  } catch (error) {
    console.error('Error rendering page:', error);
    return res.status(500).send('An error occurred when trying to render the page.');
  }
};

// Retrieve and display the size of each file uploaded by a user - so the space each file takes up can be tracked
const displaySizeOfEachFile = async (req, res) => {
  try {
    const userId = req.user.id;

    const files = await File.fetchSizeOfEachFile(userId);
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
    console.error('Error rendering page:', error);
    res.status(500).send('An error occurred when trying to render the page.');
  }
};

export {
  displayStoredFilesAndFolders,
  displayFilesInFolder,
  displaySharedFiles,
  displayDeletedFiles,
  displaySizeOfEachFile,
};
