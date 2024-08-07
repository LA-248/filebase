import {
  openFilePicker,
  openFolderPicker,
  submitFile,
  submitFolder,
} from './modules/services/upload.js';
import trackCurrentFolder from './modules/utilities/track-current-folder.js';
import handleSearches from './modules/utilities/file-search.js';
import setupDropboxChooser from './modules/services/dropbox-import.js';

openFilePicker();
openFolderPicker();

submitFile();
submitFolder();

trackCurrentFolder();

handleSearches();

setupDropboxChooser();
