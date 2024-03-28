import { removeEmptyTextPlaceholders } from '../file-management/append-file-ui.js';
import { openShareFolderModal } from './share-folder-modal.js';

// Add a new file entry to the UI after a file is uploaded
export default function appendUploadedFolderToUI(folderName) {
  try {
    const uploadedFoldersContainer = document.querySelector(
      '.uploaded-folders-container'
    );

    const folderContainer = document.createElement('div');
    const folderItem = document.createElement('div');
    const uploadedFolder = document.createElement('a');
    const actionButtonsContainer = document.createElement('div');
    const typeSubtext = document.createElement('div');
    const deleteButton = document.createElement('button');
    const favouriteFolderButton = document.createElement('button');
    const shareFolderButton = document.createElement('button');

    folderContainer.className = 'folder-container';
    folderItem.className = 'folder-item';
    uploadedFolder.className = 'uploaded-folder';
    uploadedFolder.href = `/folder/${folderName}`;
    typeSubtext.className = 'type-subtext';
    actionButtonsContainer.className = 'action-buttons-container';
    deleteButton.className = 'delete-folder-button';
    favouriteFolderButton.className = 'folder-favourite-button';
    shareFolderButton.className = 'share-folder-button';

    uploadedFolder.textContent = folderName;
    typeSubtext.textContent = 'Folder';
    deleteButton.textContent = 'Delete';
    favouriteFolderButton.textContent = 'Add to favourites';
    shareFolderButton.textContent = 'Share';

    shareFolderButton.addEventListener('click', function () {
      openShareFolderModal();
    });

    folderContainer.appendChild(folderItem);
    folderItem.appendChild(uploadedFolder);
    folderItem.appendChild(typeSubtext);
    folderItem.appendChild(actionButtonsContainer);
    actionButtonsContainer.appendChild(deleteButton);
    actionButtonsContainer.appendChild(favouriteFolderButton);
    actionButtonsContainer.appendChild(shareFolderButton);

    uploadedFoldersContainer.appendChild(folderContainer);

    removeEmptyTextPlaceholders();
  } catch (error) {
    console.error('Error:', error.message);
  }
}
