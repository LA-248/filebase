import { openFilePicker, openFolderPicker, submitFile, submitFolder } from './modules/file-management/upload.js';
import deleteFile from './modules/file-management/delete.js';
import downloadFile from './modules/file-management/download.js';

openFilePicker();
openFolderPicker();
submitFile();
submitFolder();

deleteFile();
downloadFile();
