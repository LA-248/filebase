import { openFilePicker, submitFile } from './modules/file-management/upload.js';
import { displayAllFiles } from './modules/file-management/display.js';
import deleteFile from './modules/file-management/delete.js';
import downloadFile from './modules/file-management/download.js';
import previewFile from './modules/file-management/preview.js';

openFilePicker();
submitFile();

displayAllFiles();
deleteFile();
downloadFile();
previewFile();

document.getElementById('google-sign-in').addEventListener('click', function() {
  window.location.href = '/auth/google';
});
