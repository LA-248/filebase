const modal = document.getElementById('share-folder-modal');
const cancelButton = document.getElementById('cancel-folder-share-button');
const shareFolderButtons = document.querySelectorAll('.share-folder-button');
const copyLinkButton = document.querySelector('.copy-folder-link-button');
const createLinkButton = document.querySelector('.create-folder-link-button');
const deleteLinkButton = document.querySelector('.delete-folder-link-button');

function openShareFolderModal() {
  modal.style.display = 'block';
}

// Generate a new link for sharing
function createNewLink() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('create-folder-link-button')) {
      const folderName = document.querySelector('.folder-name').textContent;

      try {
        const response = await fetch(`/create-folder-uuid/${folderName}`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          const uuid = data.uuid;

          // Set new UUID and update UI
          copyLinkButton.href = `/share-folder/${uuid}`;
          createLinkButton.textContent = 'New link created';
          deleteLinkButton.classList.remove('inactive');
          deleteLinkButton.textContent = 'Delete link';

          cancelButton.parentNode.insertBefore(
            copyLinkButton,
            cancelButton.nextSibling
          );
        } else {
          console.error(await response.json());
          // Update UI to reflect the error state
          createLinkButton.textContent = 'Failed to create link, try again';
        }
      } catch (error) {
        console.error('Error creating shareable link:', error.message);
      }
    }

    if (!event.target.classList.contains('create-folder-link-button')) {
      createLinkButton.textContent = 'Create new link';
    }
  });
}

// Delete shareable link and modify button styling accordingly
function deleteLink() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-folder-link-button')) {
      const folderName = document.querySelector('.folder-name').textContent;
      try {
        const response = await fetch(`/delete-folder-uuid/${folderName}`, {
          method: 'POST',
        });

        if (response.ok) {
          // Update UI after link has been deleted
          event.target.textContent = 'No link exists';
          event.target.classList.add('inactive');

          copyLinkButton.remove();
        } else {
          throw new Error('Server responded with an error: ' + response.status);
        }
      } catch (error) {
        console.error('Error deleting link:', error.message);
      }
    }
  });
}

// Fetch information on whether a folder has been shared or not
function retrieveSharedStatus() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('share-folder-button')) {
      const folderName = event.target
        .closest('.folder-container')
        .querySelector('.uploaded-folder').textContent;

      try {
        const response = await fetch(`/folder-shared-status/${folderName}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();

          // Update UI according to whether the file has been shared or not
          if (data.sharedStatus.shared === 'false') {
            deleteLinkButton.textContent = 'No link exists';
            deleteLinkButton.classList.add('inactive');

            copyLinkButton.remove();
          } else {
            deleteLinkButton.textContent = 'Delete link';
            deleteLinkButton.classList.remove('inactive');

            cancelButton.parentNode.insertBefore(
              copyLinkButton,
              cancelButton.nextSibling
            );
          }
        } else {
          throw new Error('Server responded with an error: ' + response.status);
        }
      } catch (error) {
        console.error('Error retrieving shared status of file:', error.message);
      }
    }
  });
}

function closeShareModal() {
  modal.style.display = 'none';
}

function copyLinkToClipboard(event, element) {
  event.preventDefault();

  // Explicitly define the base URL
  const baseURL = 'http://localhost:3000';

  // Get the path from the 'href' attribute of the link
  const hrefAttribute = event.target.getAttribute('href');

  // Concatenate the base URL with the href attribute value
  const fullURL = baseURL + hrefAttribute;

  // Use the Clipboard API to copy the href value to the clipboard
  navigator.clipboard.writeText(fullURL).then(
    function () {
      element.textContent = 'Link copied to clipboard';
    },
    function (err) {
      console.error('Error in copying link: ', err);
    }
  );
}

// Set the name of the current file being shared in the modal
function setFolderNameInShareModal() {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('share-folder-button')) {
      const getFolderName = event.target
        .closest('.folder-container')
        .querySelector('.uploaded-folder').textContent;
      const folderName = document.querySelector('.folder-name');
      folderName.textContent = getFolderName;
    }
  });
}

// Attach a shareable link to each copy-link-button inside the modal, for each file
shareFolderButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const uuid = this.getAttribute('data-uuid');
    copyLinkButton.href = `/share-folder/${uuid}`;
    modal.style.display = 'block';
  });
});

// When clicking anywhere outside the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

if (cancelButton) {
  cancelButton.onclick = closeShareModal;
  cancelButton.addEventListener('click', () => {
    copyLinkButton.textContent = 'Copy link';
  });
}

if (copyLinkButton) {
  // If the user clicks anywhere outside of the copy-link-button, reset its text
  document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('copy-folder-link-button')) {
      copyLinkButton.textContent = 'Copy link';
    }
  });

  copyLinkButton.addEventListener('click', (event) => {
    copyLinkToClipboard(event, copyLinkButton);
  });
}

if (createLinkButton) {
  createNewLink();
}

deleteLink();
retrieveSharedStatus();

export { openShareFolderModal, setFolderNameInShareModal, copyLinkToClipboard };
