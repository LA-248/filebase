import { openShareModal } from '../modals/share-item-modal.js';

let isEmptyTextPlaceholderDisplayed = true;

// Function to remove text placeholders that are displayed when no files/folders exist
function removeEmptyTextPlaceholders() {
  if (isEmptyTextPlaceholderDisplayed) {
    try {
      const emptyTextHeader = document.querySelector('.empty-text-header');
      const emptyText = document.querySelector('.empty-text');
      emptyTextHeader?.remove();
      emptyText?.remove();
      isEmptyTextPlaceholderDisplayed = false;
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

// Handle setting the name of the file/folder in the share modal
function setItemNameInModal(itemType, button) {
  const modal = document.getElementById(`share-${itemType}-modal`);
  const currentPath = window.location.pathname;

  // File name needs to be set differently depending on which page the user is on
  if (currentPath.includes('/home') || currentPath.includes('/favourites') || currentPath.includes('/folders') || currentPath.includes('/shared')) {
    const itemNameSelector = `.uploaded-${itemType}`;
    const itemContainer = button.closest(`.${itemType}-container`);
    const itemNameElement = itemContainer.querySelector(itemNameSelector);
    const modalItemNameElement = modal.querySelector(`.${itemType}-name`);
    modalItemNameElement.textContent = itemNameElement.textContent;
  } else if (currentPath.includes('/files')) {
    const modalItemNameElement = modal.querySelector(`.${itemType}-name`);
    modalItemNameElement.textContent = document.querySelector('.file-name').textContent;
  }
}

// Add a new file entry to the UI after a file is uploaded
function appendUploadedItemToUI(itemName, itemType, itemSubtext) {
  try {
    const uploadedItemsContainer = document.querySelector(
      `.uploaded-${itemType}s-container`
    );

    const itemContainer = document.createElement('div');
    const item = document.createElement('div');
    const uploadedItem = document.createElement('a');
    const actionButtonsContainer = document.createElement('div');
    const itemTypeContainer = document.createElement('div');
    const typeSubtext = document.createElement('div');
    const downloadButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const favouriteButton = document.createElement('button');
    const renameButton = document.createElement('button');
    const shareButton = document.createElement('button');

    itemContainer.className = `${itemType}-container`;
    item.className = `${itemType}-item`;
    uploadedItem.className = `uploaded-${itemType}`;
    itemType === 'file' ? (uploadedItem.href = `/files/${itemName}`) : (uploadedItem.href = `/folders/${itemName}`);
    itemTypeContainer.className = 'item-type-container';
    typeSubtext.className = 'type-subtext';
    actionButtonsContainer.className = 'action-buttons-container';
    downloadButton.className = `download-${itemType}-button`;
    deleteButton.className = `delete-${itemType}-button`;
    favouriteButton.className = `${itemType}-favourite-button`;
    renameButton.className = `rename-${itemType}-button`;
    shareButton.className = `share-${itemType}-button`;

    uploadedItem.textContent = itemName;
    typeSubtext.textContent = itemSubtext;
    downloadButton.textContent = 'Download';
    deleteButton.textContent = 'Delete';
    favouriteButton.textContent = 'Add to favourites';
    renameButton.textContent = 'Rename';
    shareButton.textContent = 'Share';

    shareButton.addEventListener('click', function () {
      itemType === 'file' ? setItemNameInModal('file', this) : setItemNameInModal('folder', this);
      itemType === 'file' ? openShareModal('file', 'files') : openShareModal('folder', 'folders');
    });

    item.appendChild(uploadedItem);
    item.appendChild(itemTypeContainer);
    itemTypeContainer.appendChild(typeSubtext);
    item.appendChild(actionButtonsContainer);
    itemType === 'file' ? actionButtonsContainer.appendChild(downloadButton) : null;
    actionButtonsContainer.appendChild(deleteButton);
    actionButtonsContainer.appendChild(favouriteButton);
    actionButtonsContainer.appendChild(renameButton);
    actionButtonsContainer.appendChild(shareButton);
    itemContainer.appendChild(item);

    uploadedItemsContainer.appendChild(itemContainer);

    removeEmptyTextPlaceholders();
  } catch (error) {
    console.error(`Error appending ${itemType} to UI:`, error.message);
  }
}

export {
  removeEmptyTextPlaceholders,
  appendUploadedItemToUI,
  setItemNameInModal,
};
