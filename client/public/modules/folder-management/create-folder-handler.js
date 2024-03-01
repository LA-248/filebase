import appendUploadedFolderToUI from './append-folder-ui.js';
import { closeCreateFolderModal } from './create-folder-modal.js';

export default function createFolder() {
  const createButton = document.getElementById('create-button');

  createButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('folder-name-input');
    const folderName = nameInput.value;

    try {
      const response = await fetch('/create-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: folderName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
  
        appendUploadedFolderToUI(data.folderName);
        closeCreateFolderModal();
      } else {
        console.error(await response.json());
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}

createFolder();
