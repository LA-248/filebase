import { openShareModal } from './share-item-modal.js';

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
  
  const itemNameSelector = `.uploaded-${itemType}`;
  const itemContainer = button.closest(`.${itemType}-container`);
  const itemNameElement = itemContainer.querySelector(itemNameSelector);
  const modalItemNameElement = modal.querySelector(`.${itemType}-name`);
  modalItemNameElement.textContent = itemNameElement.textContent;
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
    const typeSubtext = document.createElement('div');
    const downloadButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const favouriteButton = document.createElement('button');
    const shareButton = document.createElement('button');

    itemContainer.className = `${itemType}-container`;
    item.className = `${itemType}-item`;
    uploadedItem.className = `uploaded-${itemType}`;
    itemType === 'file' ? uploadedItem.href = `/preview/${itemName}` : uploadedItem.href = `/folder/${itemName}`;
    typeSubtext.className = 'type-subtext';
    actionButtonsContainer.className = 'action-buttons-container';
    downloadButton.className = `download-${itemType}-button`;
    deleteButton.className = `delete-${itemType}-button`;
    favouriteButton.className = `${itemType}-favourite-button`;
    shareButton.className = `share-${itemType}-button`;

    uploadedItem.textContent = itemName;
    typeSubtext.textContent = itemSubtext;
    downloadButton.textContent = 'Download';
    deleteButton.textContent = 'Delete';
    favouriteButton.textContent = 'Add to favourites';
    shareButton.textContent = 'Share';

    shareButton.addEventListener('click', function () {
      itemType === 'file' ? setItemNameInModal('file', this) : setItemNameInModal('folder', this);
      itemType === 'file' ? openShareModal('file') : openShareModal('folder');
    });

    item.appendChild(uploadedItem);
    item.appendChild(typeSubtext);
    item.appendChild(actionButtonsContainer);
    itemType === 'file' ? actionButtonsContainer.appendChild(downloadButton) : null;
    actionButtonsContainer.appendChild(deleteButton);
    actionButtonsContainer.appendChild(favouriteButton);
    actionButtonsContainer.appendChild(shareButton);
    itemContainer.appendChild(item);

    uploadedItemsContainer.appendChild(itemContainer);

    removeEmptyTextPlaceholders();
  } catch (error) {
    console.error(`Error appending ${itemType} to UI:`, error.message);
  }
}

export { removeEmptyTextPlaceholders, appendUploadedItemToUI, setItemNameInModal };
