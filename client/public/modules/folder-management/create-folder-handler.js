import { appendUploadedItemToUI } from '../file-management/append-item-ui.js';
import { closeCreateFolderModal } from './create-folder-modal.js';

export default function createFolder() {
  const createButton = document.getElementById('create-button');
  const folderForm = document.getElementById('folder-form');
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-creating-folder-text';

  createButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('folder-name-input');
    const folderName = nameInput.value;
    const parentFolder = sessionStorage.getItem('currentFolder');

    try {
      const response = await fetch('/create-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: folderName, parentFolder: parentFolder }),
      });

      if (response.ok) {
        const data = await response.json();

        appendUploadedItemToUI(data.folderName, 'folder', 'Folder');
        closeCreateFolderModal();
      } else {
        // Show error message in UI
        const errorResponse = await response.json();
        console.error(errorResponse);

        errorMessage.textContent = errorResponse;
        folderForm.appendChild(errorMessage);
        setTimeout(() => {
          errorMessage.remove();
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}

createFolder();
