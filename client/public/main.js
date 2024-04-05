import { openFilePicker, openFolderPicker, submitFile, submitFolder } from './modules/file-management/upload.js';
import trackCurrentFolder from './utilities/track-current-folder.js';
import handleFileFavourites from './modules/file-management/favourites-handler.js';
import handleFolderFavourites from './modules/folder-management/folder-favourites-handler.js';
import handleSearches from './utilities/file-search.js';

openFilePicker();
openFolderPicker();
submitFile();
submitFolder();

handleFileFavourites();
handleFolderFavourites();

trackCurrentFolder();

handleSearches();
