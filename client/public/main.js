import { openFilePicker, submitFile } from './modules/file-upload.js';
import getFiles from './modules/fetch-files.js';
import { displayAllFiles } from './modules/display-files.js';
import deleteFile from './modules/delete-file.js';
import downloadFile from './modules/download.js';

openFilePicker();
submitFile();

getFiles();
displayAllFiles();
deleteFile();
downloadFile();
