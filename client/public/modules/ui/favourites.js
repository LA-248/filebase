import { markItemAsDeleted } from './delete.js';

// Unified function that handles favourites for both files and folders
export default function handleFavourites(itemType, itemContainerClass, itemElementSelector, apiResource) {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains(`${itemType}-favourite-button`)) {
      const favouriteButton = event.target;
      const itemContainer = event.target.closest(itemContainerClass);
      const itemName = event.target.closest(itemContainerClass).querySelector(itemElementSelector).textContent;
      const encodedItemName = encodeURIComponent(itemName);

      try {
        if (favouriteButton.textContent === 'Add to favourites') {
          const response = await fetch(`/${apiResource}/${encodedItemName}/favourite`, {
            method: 'PUT',
          });

          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
          } else {
            favouriteButton.textContent = 'Remove from favourites';
          }
        } else {
          // Get current path to determine UI behaviour when removing a file from favourites (explained more below)
          const currentPath = window.location.pathname;
          const response = await fetch(`/${apiResource}/${encodedItemName}/favourite`, {
            method: 'DELETE',
          });

          // If the current URL path is '/favourites' (file or folder is being removed from inside the favourites tab), remove the the item from the UI - otherwise only change the button text
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
          }
          
          favouriteButton.textContent = 'Add to favourites';
          
          if (currentPath === '/favourites') {
            itemContainer.remove();
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
}

handleFavourites('file', '.file-container', '.uploaded-file', 'files');
handleFavourites('folder', '.folder-container', '.uploaded-folder', 'folders');

/* 
Call these functions here so their functionality works on both the homepage and favourites page
- (there's definitely a better way to do this)
*/
markItemAsDeleted('file', 'files');
markItemAsDeleted('folder', 'folders');
