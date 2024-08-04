import { closeDeleteModal } from '../modals/permanently-delete-item-modal.js';

function markItemAsDeleted(itemName, apiResource) {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains(`delete-${itemName}-button`)) {
      const itemContainer = event.target.closest(`.${itemName}-container`);
      const uploadedItemName = event.target.closest(`.${itemName}-container`).querySelector(`.uploaded-${itemName}`).textContent;
      const encodedItemName = encodeURIComponent(uploadedItemName);

      try {
        const response = await fetch(`/${apiResource}/${encodedItemName}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message);
        }
        itemContainer.remove();
      } catch (error) {
        console.error(error.message);
      }
    }
  });
}

function restoreItem(itemName, apiResource) {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains(`restore-${itemName}-button`)) {
      const itemContainer = event.target.closest(`.${itemName}-container`);
      const uploadedItemName = event.target.closest(`.${itemName}-container`).querySelector(`.uploaded-${itemName}`).textContent;
      const encodedItemName = encodeURIComponent(uploadedItemName);

      try {
        const response = await fetch(`/${apiResource}/${encodedItemName}/restore`, {
          method: 'PUT',
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message);
        }
        itemContainer.remove();
      } catch (error) {
        console.error(error.message);
      }
    }
  });
}

function permanentlyDeleteItem(itemName, apiResource) {
  document.addEventListener('click', async (event) => {
    if (event.target.id === `confirm-${itemName}-delete-button`) {
      const itemContainers = document.querySelectorAll(`.${itemName}-container`);
      const uploadedItemName = document.querySelector(`.${itemName}-name`).textContent;
      const encodedItemName = encodeURIComponent(uploadedItemName);

      try {
        const response = await fetch(`/${apiResource}/${encodedItemName}/permanent`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message);
        }

        // Need to loop through each container and find a match with the file/folder that was deleted so it can be removed from the UI
        itemContainers.forEach(container => {
          const containerItemName = container.querySelector(`.uploaded-${itemName}`).textContent;
          if (containerItemName === uploadedItemName) {
            container.remove();
            closeDeleteModal();
          }
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  });
}

restoreItem('file', 'files');
restoreItem('folder', 'folders');

permanentlyDeleteItem('file', 'files');
permanentlyDeleteItem('folder', 'folders');

export { markItemAsDeleted }
