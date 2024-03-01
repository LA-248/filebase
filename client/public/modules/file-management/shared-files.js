import searchFiles from '../../utilities/file-search.js';
import { setFileNameInShareModal } from './share-file-modal.js';

setFileNameInShareModal();

searchFiles();

const fileSearch = document.getElementById('search-files-input');
fileSearch.addEventListener('keyup', () => {
  searchFiles();
});
