import { openShareFileModal } from './share-file-modal.js';

let isEmptyTextPlaceholderDisplayed = true;

// Function to remove empty text placeholders
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

// Add a new file entry to the UI after a file is uploaded
function appendUploadedFileToUI(fileName) {
  try {
    const uploadedFilesContainer = document.querySelector(
      '.uploaded-files-container'
    );

    const fileContainer = document.createElement('div');
    const fileItem = document.createElement('div');
    const uploadedFile = document.createElement('a');
    const actionButtonsContainer = document.createElement('div');
    const typeSubtext = document.createElement('div');
    const downloadButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const favouriteButton = document.createElement('button');
    const shareButton = document.createElement('button');

    fileContainer.className = 'file-container';
    fileItem.className = 'file-item';
    uploadedFile.className = 'uploaded-file';
    uploadedFile.href = `/preview/${fileName}`;
    typeSubtext.className = 'type-subtext';
    actionButtonsContainer.className = 'action-buttons-container';
    downloadButton.className = 'download-button';
    deleteButton.className = 'delete-file-button';
    favouriteButton.className = 'favourite-button';
    shareButton.className = 'share-file-button';

    uploadedFile.textContent = fileName;
    typeSubtext.textContent = 'File';
    downloadButton.textContent = 'Download';
    deleteButton.textContent = 'Delete';
    favouriteButton.textContent = 'Add to favourites';
    shareButton.textContent = 'Share';

    shareButton.addEventListener('click', function () {
      openShareFileModal();
    });

    fileContainer.appendChild(fileItem);
    fileItem.appendChild(uploadedFile);
    fileItem.appendChild(typeSubtext);
    fileItem.appendChild(actionButtonsContainer);
    actionButtonsContainer.appendChild(downloadButton);
    actionButtonsContainer.appendChild(deleteButton);
    actionButtonsContainer.appendChild(favouriteButton);
    actionButtonsContainer.appendChild(shareButton);

    uploadedFilesContainer.appendChild(fileContainer);

    removeEmptyTextPlaceholders();
  } catch (error) {
    console.error('Error appending file to UI:', error.message);
  }
}

export { removeEmptyTextPlaceholders, appendUploadedFileToUI };
