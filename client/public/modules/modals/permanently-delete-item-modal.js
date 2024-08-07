const modal = document.getElementById('permanently-delete-item-modal');
const confirmDeleteButton = document.getElementById('confirm-delete-button');
const itemName = document.querySelector('.file-name');

function openModal() {
  modal.style.display = 'block';
}

function closeDeleteModal() {
  modal.style.display = 'none';
}

// Retrieve the name of a file or folder
function retrieveItemName(itemType, event) {
  const uploadedItemName = event.target.closest(`.${itemType}-container`).querySelector(`.uploaded-${itemType}`).textContent;
  return uploadedItemName;
}

// Set the item name and button class in the modal according to whether it's a file or folder
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('permanently-delete-file-button') || event.target.classList.contains('permanently-delete-folder-button')) {
    if (event.target.classList.contains('permanently-delete-file-button')) {
      confirmDeleteButton.id = 'confirm-file-delete-button';
      itemName.className = 'file-name';
      const fileName = retrieveItemName('file', event);
      itemName.textContent = fileName;
    } else {
      confirmDeleteButton.id = 'confirm-folder-delete-button';
      itemName.className = 'folder-name';
      const folderName = retrieveItemName('folder', event);
      itemName.textContent = folderName;
    }
    openModal();
  }
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

const cancelButton = document.getElementById('cancel-delete-button');
if (cancelButton) {
  cancelButton.addEventListener('click', closeDeleteModal);
}

export { closeDeleteModal };
