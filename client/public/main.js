import { openFilePicker, openFolderPicker, submitFile, submitFolder } from './modules/file-management/upload.js';
import deleteFile from './modules/file-management/delete-file.js';
import deleteFolder from './modules/folder-management/delete-folder.js';
import downloadFile from './modules/file-management/download.js';
import createFolder from './modules/folder-management/create-folder-handler.js';

openFilePicker();
openFolderPicker();
submitFile();
submitFolder();

deleteFile();
deleteFolder();

downloadFile();

createFolder();
