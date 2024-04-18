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

          if (response.ok) {
            favouriteButton.textContent = 'Remove from favourites';
          } else {
            console.error(await response.json());
          }
        } else {
          // Append the current URL path as a query parameter - used in the backend to be sent back in the response to determine UI behaviour (explained more below)
          const currentPath = encodeURIComponent(window.location.pathname);
          const response = await fetch(`/${apiResource}/${encodedItemName}/favourite?currentPath=${currentPath}`, {
            method: 'DELETE',
          });

          // If the current URL path is '/favourites' (folder is being removed from inside the favourites tab), remove the folder from the UI - otherwise only change the button text
          if (response.ok) {
            const data = await response.json();

            favouriteButton.textContent = 'Add to favourites';
            
            if (data === '/favourites') {
              itemContainer.remove();
            }
          } else {
            console.error(await response.json());
          }
        }
      } catch (error) {
        console.error('Error:', error.message);
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
