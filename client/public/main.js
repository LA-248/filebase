import { openFilePicker, openFolderPicker, submitFile, submitFolder } from './modules/file-management/upload.js';
import { confirmFileDelete, deleteFile } from './modules/file-management/delete-file.js';
import { confirmFolderDelete, deleteFolder } from './modules/folder-management/delete-folder.js';
import trackCurrentFolder from './utilities/session-folder-manager.js';
import handleFileFavourites from './modules/file-management/favourites-handler.js';

openFilePicker();
openFolderPicker();
submitFile();
submitFolder();

confirmFileDelete();
deleteFile();

confirmFolderDelete();
deleteFolder();

handleFileFavourites();

trackCurrentFolder();
