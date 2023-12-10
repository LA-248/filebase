import { openFilePicker, submitFile } from './modules/file-management/upload.js';
import deleteFile from './modules/file-management/delete.js';
import downloadFile from './modules/file-management/download.js';
import previewFile from './modules/file-management/preview.js';

openFilePicker();
submitFile();

deleteFile();
downloadFile();
previewFile();
