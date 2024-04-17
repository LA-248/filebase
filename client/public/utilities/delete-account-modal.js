const modal = document.getElementById('delete-account-modal');
const openDeleteAccountModalButton = document.querySelector('.open-delete-account-modal-button');
const cancelButton = document.getElementById('cancel-account-deletion-button');

// Permanently delete a user's account and all their data
function deleteAccount() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-account-button')) {
      try {
        const response = await fetch('/account', {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Server responded with an error: ' + response.status);
        }

        // If the account was successfully deleted, redirect to login page
        window.location.href = '/login';
      } catch (error) {
        console.error('Error deleting account:', error.message);
      }
    }
  });
}

function openDeleteAccountModal() {
  modal.style.display = 'block';
}

function closeDeleteAccountModal() {
  modal.style.display = 'none';
}

// Open the delete account modal
openDeleteAccountModalButton.addEventListener('click', openDeleteAccountModal);

// When clicking anywhere outside the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Close modal when 'Cancel' button is clicked and reset 'Copy link' button text
if (cancelButton) {
  cancelButton.onclick = closeDeleteAccountModal;
  cancelButton.addEventListener('click', () => {
    copyLinkButton.textContent = 'Copy link';
  });
}

deleteAccount();
