import searchFiles from './file-search.js';
import { setFileNameInShareModal } from '../modules/file-management/share-file-modal.js';
import { setFolderNameInShareModal } from '../modules/folder-management/share-folder-modal.js';

setFileNameInShareModal();
setFolderNameInShareModal();

searchFiles();

const fileSearch = document.getElementById('search-files-input');
fileSearch.addEventListener('keyup', () => {
  searchFiles();
});
