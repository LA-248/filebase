import searchFiles from './file-search.js';
import { setFileNameInShareModal } from '../modules/file-management/share-file-modal.js';

setFileNameInShareModal();

searchFiles();

const fileSearch = document.getElementById('search-files-input');
fileSearch.addEventListener('keyup', () => {
  searchFiles();
});
