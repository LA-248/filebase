import { openFilePicker, openFolderPicker, submitFile, submitFolder } from './modules/file-management/upload.js';
import deleteFile from './modules/file-management/delete.js';
import downloadFile from './modules/file-management/download.js';
import createFolder from './modules/folder-management/create-folder.js';

openFilePicker();
openFolderPicker();
submitFile();
submitFolder();

deleteFile();
downloadFile();

createFolder();
