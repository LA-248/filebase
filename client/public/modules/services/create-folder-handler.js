import { appendUploadedItemToUI } from '../ui/append-item-ui.js';
import { closeCreateFolderModal } from '../modals/create-folder-modal.js';

// Creates a new folder entry in the UI and sends its information to the backend for storage
export default function createFolder() {
  const createButton = document.getElementById('create-button');
  const folderForm = document.getElementById('folder-form');
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';

  createButton.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
      // Retrieve the name of the folder created to then be sent to the backend to be stored in the database
      const nameInput = document.getElementById('folder-name-input');
      const folderName = nameInput.value;

      // Retrieve the name of the current parent folder to display created folders under the correct parent
      const parentFolder = sessionStorage.getItem('currentFolder');
      const rootFolder = sessionStorage.getItem('rootFolder');

      const response = await fetch('/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: folderName, rootFolder: rootFolder, parentFolder: parentFolder }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
      const data = await response.json();

      // Append created folder to UI with relevant data and close the modal
      appendUploadedItemToUI(data.folderName, 'folder', 'Folder');
      closeCreateFolderModal();
      nameInput.value = '';
    } catch (error) {
      // Show error message in UI
      errorMessage.textContent = error.message;
      folderForm.appendChild(errorMessage);
      setTimeout(() => {
        errorMessage.remove();
      }, 5000);
    }
  });
}

createFolder();
