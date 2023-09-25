import { openFilePicker, submitFile } from './modules/file-upload.js';
import getFiles from './modules/fetch-files.js';
import displayFiles from './modules/display-files.js';

openFilePicker();
submitFile();

getFiles();
displayFiles();
