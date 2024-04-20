const modal = document.getElementById('rename-modal');

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('rename-folder-button') || event.target.classList.contains('rename-file-button')) {
    openModal();
  }
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

const cancelButton = document.getElementById('cancel-rename-button');
cancelButton.addEventListener('click', closeModal);

// Handle file and folder renames
function renameItem(apiResource, itemType) {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains(`rename-${itemType}-button`)) {
      const currentNameElement = event.target.closest(`.${itemType}-container`).querySelector(`.uploaded-${itemType}`);
      const currentName = currentNameElement.textContent;
      const uploadedItem = document.querySelector(`.uploaded-${itemType}`);

      const renameForm = document.getElementById('rename-form');
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';

      renameForm.addEventListener('submit', async (formEvent) => {
        formEvent.preventDefault();
        const renameInput = document.getElementById('rename-input');
        const newName = renameInput.value;

        try {
          const response = await fetch(`/${apiResource}/${currentName}/rename`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName: newName }),
          });

          if (response.ok) {
            const data = await response.json();

            currentNameElement.textContent = data.finalNewName;
            console.log(data.finalNewName)
            uploadedItem.href = `/${apiResource}/${data.finalNewName}`;
            closeModal();
          } else {
            // Show error message in UI
            const errorResponse = await response.json();
            console.error(errorResponse);
            errorMessage.textContent = errorResponse;
            renameForm.appendChild(errorMessage);
            setTimeout(() => {
              errorMessage.remove();
            }, 5000);
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      })
    }
  });
}

renameItem('folders', 'folder');
renameItem('files', 'file');
