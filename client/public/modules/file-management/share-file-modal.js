const modal = document.getElementById('share-file-modal');
const cancelButton = document.getElementById('cancel-share-button');
const shareFileButtons = document.querySelectorAll('.share-file-button');
const copyLinkButton = document.querySelector('.copy-link-button');
const createLinkButton = document.querySelector('.create-link-button');
const deleteLinkButton = document.querySelector('.delete-link-button');

function openShareFileModal() {
  modal.style.display = 'block';
}

// Generate a new link for sharing
function createNewLink() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('create-link-button')) {
      const fileName = document.querySelector('.file-name').textContent;

      try {
        const response = await fetch(`/create-file-uuid/${fileName}`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          const uuid = data.uuid;

          // Set new UUID and update UI
          copyLinkButton.href = `/share/${uuid}`;
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

    if (!event.target.classList.contains('create-link-button')) {
      createLinkButton.textContent = 'Create new link';
    }
  });
}

// Delete shareable link and modify button styling accordingly
function deleteLink() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-link-button')) {
      const fileName = document.querySelector('.file-name').textContent;
      try {
        const response = await fetch(`/delete-file-uuid/${fileName}`, {
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

// Fetch information on whether a file has been shared or not
function retrieveSharedStatus() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('share-file-button')) {
      const fileName = event.target
        .closest('.file-container')
        .querySelector('.uploaded-file').textContent;

      try {
        const response = await fetch(`/fetch-shared-status/${fileName}`, {
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
function setFileNameInShareModal() {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('share-file-button')) {
      const getFileName = event.target
        .closest('.file-container')
        .querySelector('.uploaded-file').textContent;
      const fileName = document.querySelector('.file-name');
      fileName.textContent = getFileName;
    }
  });
}

// Attach a shareable link to each copy-link-button inside the modal, for each file
shareFileButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const uuid = this.getAttribute('data-uuid');
    copyLinkButton.href = `/share/${uuid}`;
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
    if (!event.target.classList.contains('copy-link-button')) {
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

export { openShareFileModal, setFileNameInShareModal, copyLinkToClipboard };
