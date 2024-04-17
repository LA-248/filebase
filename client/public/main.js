import { openFilePicker, openFolderPicker, submitFile, submitFolder } from './modules/file-management/upload.js';
import trackCurrentFolder from './utilities/track-current-folder.js';
import handleSearches from './utilities/file-search.js';

openFilePicker();
openFolderPicker();
submitFile();
submitFolder();

trackCurrentFolder();

handleSearches();
