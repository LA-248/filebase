import { setItemNameInModal } from '../ui/append-item-ui.js';
import { openShareModal } from './share-item-modal.js';

const shareButton = document.querySelector('.share-file-button');

shareButton.addEventListener('click', function () {
  setItemNameInModal('file', this);
  openShareModal('file', 'files');
});
