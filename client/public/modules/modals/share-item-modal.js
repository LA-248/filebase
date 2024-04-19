import { setItemNameInModal } from '../ui/append-item-ui.js';

// Retrieve the uuid of a file or folder
async function retrieveUuid(itemType, resource) {
  const modal = document.getElementById(`share-${itemType}-modal`);
  const copyLinkButton = document.querySelector(`.copy-${itemType}-link-button`);
  const modalItemNameElement = modal.querySelector(`.${itemType}-name`).textContent;

  if (copyLinkButton) {
    try {
      const response = await fetch(`/${resource}/${modalItemNameElement}/uuid`, {
          method: 'GET',
        }
      );
      const data = await response.json();

      // If the file has been shared, set up the link for sharing
      if (data.sharedStatus === 'true') {
        copyLinkButton.href = `/${resource}/${data.uuid}/share`;
      }
    } catch (error) {
      console.error('Error fetching uuid:', error);
    }
  }
}

function openShareModal(itemType, resource) {
  const modal = document.getElementById(`share-${itemType}-modal`);
  modal.style.display = 'block';

  // Attach retrieved uuid to the 'Copy link' button of the file/folder when the share modal is opened
  retrieveUuid(itemType, resource);
}

// Unified function to setup sharing modal actions for either files or folders
function setupShareModalActions(itemType, resource) {
  const modal = document.getElementById(`share-${itemType}-modal`);
  const cancelButton = document.getElementById(`cancel-${itemType}-share-button`);
  const shareButtons = document.querySelectorAll(`.share-${itemType}-button`);
  const copyLinkButton = document.querySelector(`.copy-${itemType}-link-button`);
  const createLinkButton = document.querySelector(`.create-${itemType}-link-button`);
  const deleteLinkButton = document.querySelector(`.delete-${itemType}-link-button`);
  const baseUrl = 'http://localhost:3000';

  function closeShareModal() {
    modal.style.display = 'none';
    if (copyLinkButton) copyLinkButton.textContent = 'Copy link';
  }

  // Create a shareable link by sending the file or folder info to generate a uuid for it
  async function createLink(itemName) {
    try {
      const response = await fetch(`/${resource}/${itemName}/uuid`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();

        // Update UI once the link has been created
        copyLinkButton.href = `/${resource}/${data.uuid}/share`;
        createLinkButton.textContent = 'New link created';
        deleteLinkButton.classList.remove('inactive');
        deleteLinkButton.textContent = 'Delete link';

        // Insert the cancel button in the UI before the other buttons
        cancelButton.parentNode.insertBefore(copyLinkButton,cancelButton.nextSibling);

        return data.uuid;
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        // Update UI to reflect the error state
        createLinkButton.textContent = 'Failed to create link, try again';
      }
    } catch (error) {
      console.error('Error creating shareable link:', error);
      createLinkButton.textContent = 'Failed to create link, try again';
    }
  }

  // Deletes a specified file or folder link and updates the UI accordingly
  async function deleteLink(itemName) {
    try {
      const response = await fetch(`/${resource}/${itemName}/uuid`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update UI after link has been deleted
        deleteLinkButton.textContent = 'No link exists';
        deleteLinkButton.classList.add('inactive');

        copyLinkButton.remove();
      } else {
        throw new Error('Server responded with an error: ' + response.status);
      }
      if (copyLinkButton) copyLinkButton.remove();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  }

  // Handles copying the shareable link to the clipboard
  function copyLinkToClipboard(event) {
    event.preventDefault();
    const fullURL = baseUrl + copyLinkButton.getAttribute('href');

    navigator.clipboard.writeText(fullURL).then(
      () => {
        copyLinkButton.textContent = 'Link copied to clipboard';
      },
      (err) => {
        console.error('Error in copying link: ', err);
      }
    );
  }

  // Attach event listeners to each relevant button
  function attachEventListeners() {
    shareButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setItemNameInModal(itemType, button);
        openShareModal(itemType, resource);
      });
    });

    // Adds an event listener to the 'Create link' button, passing the item's name and resetting button text on click outside
    if (createLinkButton) {
      createLinkButton.addEventListener('click', () => {
        const itemName = document.querySelector(`.${itemType}-name`).textContent;
        createLink(itemName);
      });

      document.addEventListener('click', (event) => {
        if (
          !event.target.classList.contains(`create-${itemType}-link-button`)
        ) {
          createLinkButton.textContent = 'Create new link';
        }
      });
    }

    if (deleteLinkButton) {
      deleteLinkButton.addEventListener('click', () => {
        const itemName = document.querySelector(`.${itemType}-name`).textContent;
        deleteLink(itemName);
      });
    }

    if (copyLinkButton) {
      copyLinkButton.addEventListener('click', copyLinkToClipboard);

      document.addEventListener('click', (event) => {
        if (!event.target.classList.contains(`copy-${itemType}-link-button`)) {
          copyLinkButton.textContent = 'Copy link';
        }
      });
    }

    // If the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeShareModal();
      }
    });

    // Close modal when the 'Cancel' button is clicked and reset 'Copy link' button text
    if (cancelButton) {
      cancelButton.onclick = closeShareModal;
      cancelButton.addEventListener('click', () => {
        copyLinkButton.textContent = 'Copy link';
      });
    }
  }

  attachEventListeners();
}

// Retrieve the shared status of a file or folder - this is then used to update the UI accordingly
function retrieveSharedStatus(itemType, resource) {
  let itemName;
  const cancelButton = document.getElementById(`cancel-${itemType}-share-button`);
  const copyLinkButton = document.querySelector(`.copy-${itemType}-link-button`);
  const deleteLinkButton = document.querySelector(`.delete-${itemType}-link-button`);

  document.addEventListener('click', async (event) => {
    const currentPath = window.location.pathname;

    // File name needs to be retrieved differently from the DOM depending on which page the user is on
    if (event.target.classList.contains(`share-${itemType}-button`)) {
      if (currentPath.includes('/home') || currentPath.includes('/favourites') || currentPath.includes('/folders') || currentPath.includes('/shared')) {
        itemName = event.target.closest(`.${itemType}-container`).querySelector(`.uploaded-${itemType}`).textContent;
      } else if (currentPath.includes('/files')) {
        itemName = document.querySelector('.file-name').textContent;
      }

      try {
        const response = await fetch(`/${resource}/${itemName}/shared-status`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();

          // Update UI according to whether the file has been shared or not
          if (data.sharedStatus.shared === 'false') {
            if (deleteLinkButton) {
              deleteLinkButton.textContent = 'No link exists';
              deleteLinkButton.classList.add('inactive');
            }

            if (copyLinkButton) {
              copyLinkButton.remove();
            }
          } else {
            if (deleteLinkButton) {
              deleteLinkButton.textContent = 'Delete link';
              deleteLinkButton.classList.remove('inactive');
            }

            if (copyLinkButton && cancelButton) {
              cancelButton.parentNode.insertBefore(copyLinkButton,cancelButton.nextSibling);
            }
          }
        } else {
          throw new Error('Server responded with an error: ' + response.status);
        }
      } catch (error) {
        console.error(
          `Error retrieving shared status of: ${itemType}`,
          error.message
        );
      }
    }
  });
}

setupShareModalActions('file', 'files');
setupShareModalActions('folder', 'folders');

retrieveSharedStatus('file', 'files');
retrieveSharedStatus('folder', 'folders');

export { openShareModal };
