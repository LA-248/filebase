// Retrieve relevant elements from the DOM
const modal = document.getElementById('create-folder-modal');
const cancelButton = document.getElementById('cancel-button');
const createFolderButton = document.querySelector('.create-folder-button');

function openModal() {
  modal.style.display = 'block';
}

function closeCreateFolderModal() {
  modal.style.display = 'none';
}

cancelButton.onclick = closeCreateFolderModal;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    closeCreateFolderModal();
  }
};

createFolderButton.addEventListener('click', openModal);

export { closeCreateFolderModal };
