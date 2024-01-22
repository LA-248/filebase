import { openFilePicker, openFolderPicker, submitFile, submitFolder } from './modules/file-management/upload.js';
import deleteFile from './modules/file-management/delete-file.js';
import deleteFolder from './modules/folder-management/delete-folder.js';
import downloadFile from './modules/file-management/download.js';
import trackCurrentFolder from './utilities/session-folder-manager.js';
import handleFileFavourites from './modules/file-management/favourites-handler.js';

openFilePicker();
openFolderPicker();
submitFile();
submitFolder();

deleteFile();
deleteFolder();

handleFileFavourites();
downloadFile();

trackCurrentFolder();
