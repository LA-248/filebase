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

        if (response.ok) {
          itemContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
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

        if (response.ok) {
          itemContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

function permanentlyDeleteItem(itemName, apiResource) {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains(`permanently-delete-${itemName}-button`)) {
      const itemContainer = event.target.closest(`.${itemName}-container`);
      const uploadedItemName = event.target.closest(`.${itemName}-container`).querySelector(`.uploaded-${itemName}`).textContent;
      const encodedItemName = encodeURIComponent(uploadedItemName);

      try {
        const response = await fetch(`/${apiResource}/${encodedItemName}/permanent`, {
          method: 'DELETE',
        });

        if (response.ok) {
          itemContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

restoreItem('file', 'files');
restoreItem('folder', 'folders');

permanentlyDeleteItem('file', 'files');
permanentlyDeleteItem('folder', 'folders');

export { markItemAsDeleted }
