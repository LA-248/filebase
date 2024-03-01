import { removeEmptyTextPlaceholders } from '../file-management/append-file-ui.js';

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

    folderContainer.className = 'folder-container';
    folderItem.className = 'folder-item';
    uploadedFolder.className = 'uploaded-folder';
    uploadedFolder.href = `/folder/${folderName}`;
    typeSubtext.className = 'type-subtext';
    actionButtonsContainer.className = 'action-buttons-container';
    deleteButton.className = 'delete-folder-button';

    uploadedFolder.textContent = folderName;
    typeSubtext.textContent = 'Folder';
    deleteButton.textContent = 'Delete';

    folderContainer.appendChild(folderItem);
    folderItem.appendChild(uploadedFolder);
    folderItem.appendChild(typeSubtext);
    folderItem.appendChild(actionButtonsContainer);
    actionButtonsContainer.appendChild(deleteButton);

    uploadedFoldersContainer.appendChild(folderContainer);

    removeEmptyTextPlaceholders();
  } catch (error) {
    console.error('Error:', error.message);
  }
}
