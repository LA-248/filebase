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
function renameItem() {
  const renameForm = document.getElementById('rename-form');
  const renameInput = document.getElementById('rename-input');
  let currentName;
  let uploadedItem;
  
  // Set up loading and error messages
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'loading-message';
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';

  document.addEventListener('click', (event) => {
    const itemTypes = ['folder', 'file']; // List of supported item types
    itemTypes.forEach(type => {
      if (event.target.classList.contains(`rename-${type}-button`)) {
        uploadedItem = event.target.closest(`.${type}-container`).querySelector(`.uploaded-${type}`);
        currentName = uploadedItem.textContent;

        // Store the item type ('folder' or 'file') in the form's dataset for use in later operations like API calls
        renameForm.dataset.currentType = type;
      }
    });
  });

  renameForm.addEventListener('submit', async (formEvent) => {
    formEvent.preventDefault();
    const newName = renameInput.value;
    const itemType = renameForm.dataset.currentType;
    const apiResource = itemType === 'folder' ? 'folders' : 'files'; // Set the API resource based on the type

    loadingMessage.textContent = 'Renaming...'
    renameForm.appendChild(loadingMessage);

    try {
      const response = await fetch(`/${apiResource}/${currentName}/rename`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName: newName }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
      const data = await response.json();
      uploadedItem.textContent = data.finalNewName;
      uploadedItem.href = `/${apiResource}/${data.finalNewName}`;

      renameInput.value = '';
      loadingMessage.remove();
      closeModal();
    } catch (error) {
      errorMessage.textContent = error.message;
      renameForm.appendChild(errorMessage);
      loadingMessage.remove();
      openModal();
      setTimeout(() => {
        errorMessage.remove();
      }, 5000);
    }
  });
}

renameItem();
