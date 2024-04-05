function openShareModal(itemType) {
  const modal = document.getElementById(`share-${itemType}-modal`);
  modal.style.display = 'block';
}

// Unified function to setup sharing modal actions for either files or folders
function setupShareModalActions(itemType) {
  const modal = document.getElementById(`share-${itemType}-modal`);
  const cancelButton = document.getElementById(`cancel-${itemType}-share-button`);
  const shareButtons = document.querySelectorAll(`.share-${itemType}-button`);
  const copyLinkButton = document.querySelector(`.copy-${itemType}-link-button`);
  const createLinkButton = document.querySelector(`.create-${itemType}-link-button`);
  const deleteLinkButton = document.querySelector(`.delete-${itemType}-link-button`);
  const itemNameSelector = `.uploaded-${itemType}`;
  const baseUrl = 'http://localhost:3000';

  function closeShareModal() {
    modal.style.display = 'none';
    if (copyLinkButton) copyLinkButton.textContent = 'Copy link';
  }

  function setItemNameInModal(button) {
    const itemContainer = button.closest(`.${itemType}-container`);
    const itemNameElement = itemContainer.querySelector(itemNameSelector);
    const modalItemNameElement = modal.querySelector(`.${itemType}-name`);
    modalItemNameElement.textContent = itemNameElement.textContent;
  }

  async function createLink(itemName) {
    try {
      const response = await fetch(`/create-uuid/${itemType}/${itemName}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();

        copyLinkButton.href = `/share/${itemType}/${data.uuid}`;
        createLinkButton.textContent = 'New link created';
        deleteLinkButton.classList.remove('inactive');
        deleteLinkButton.textContent = 'Delete link';

        cancelButton.parentNode.insertBefore(
          copyLinkButton,
          cancelButton.nextSibling
        );

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

  async function deleteLink(itemName) {
    try {
      const response = await fetch(`/delete-uuid/${itemType}/${itemName}`, {
        method: 'POST',
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

  function copyLinkToClipboard(event) {
    event.preventDefault();
    const fullURL = baseUrl + copyLinkButton.getAttribute('href');

    navigator.clipboard.writeText(fullURL).then(() => {
      copyLinkButton.textContent = 'Link copied to clipboard';
    }, (err) => {
      console.error('Error in copying link: ', err);
    });
  }

  function attachEventListeners() {
    shareButtons.forEach(button => {
      button.addEventListener('click', () => {
        setItemNameInModal(button);
        openShareModal(itemType);
      });
    });

    if (cancelButton) cancelButton.addEventListener('click', closeShareModal);

    window.addEventListener('click', event => {
      if (event.target === modal) {
        closeShareModal();
      }
    });

    if (createLinkButton) {
      createLinkButton.addEventListener('click', () => {
        const itemName = document.querySelector(`.${itemType}-name`).textContent;
        createLink(itemName);
      });

      document.addEventListener('click', (event) => {
        if (!event.target.classList.contains(`create-${itemType}-link-button`)) {
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

    if (cancelButton) {
      cancelButton.onclick = closeShareModal;
      cancelButton.addEventListener('click', () => {
        copyLinkButton.textContent = 'Copy link';
      });
    }
    
  }

  attachEventListeners();
}

function retrieveSharedStatus(itemType) {
  const cancelButton = document.getElementById(`cancel-${itemType}-share-button`);
  const copyLinkButton = document.querySelector(`.copy-${itemType}-link-button`);
  const deleteLinkButton = document.querySelector(`.delete-${itemType}-link-button`);

  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains(`share-${itemType}-button`)) {
      const itemName = event.target.closest(`.${itemType}-container`).querySelector(`.uploaded-${itemType}`).textContent;

      try {
        const response = await fetch(`/shared-status/${itemType}/${itemName}`, {
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
              cancelButton.parentNode.insertBefore(copyLinkButton, cancelButton.nextSibling);
            }
          }
        } else {
          throw new Error('Server responded with an error: ' + response.status);
        }
      } catch (error) {
        console.error(`Error retrieving shared status of: ${itemType}`, error.message);
      }
    }
  });
}

setupShareModalActions('file');
setupShareModalActions('folder');

retrieveSharedStatus('file');
retrieveSharedStatus('folder');

export { openShareModal };
