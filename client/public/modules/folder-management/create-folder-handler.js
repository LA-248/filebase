import { closeModal } from './modal-control.js';

export default function createFolder() {
  const createButton = document.getElementById('create-button');

  createButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('folder-name-input');

    try {
      const folderName = nameInput.value;

      const response = await fetch('/create-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: folderName }),
      });

      const data = await response.json();
      console.log(data);

      closeModal();
    } catch (error) {
      console.error('Error:', error);
    }
  });
}
