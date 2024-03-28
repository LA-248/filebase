import { markFolderAsDeleted } from '../folder-management/delete-folder.js';
import { setFolderNameInShareModal } from './share-folder-modal.js';

function retrieveElements(event) {
  const favouriteButton = event.target;
  const folderContainer = event.target.closest('.folder-container');
  const folderName = event.target.closest('.folder-container').querySelector('.uploaded-folder').textContent;
  const encodedFolderName = encodeURIComponent(folderName);

  return { favouriteButton, folderContainer, encodedFolderName };
}

export default function handleFolderFavourites() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('folder-favourite-button')) {
      const { favouriteButton, folderContainer, encodedFolderName } = retrieveElements(event);

      try {
        if (favouriteButton.textContent === 'Add to favourites') {
          const response = await fetch(`/add-folder-to-favourites/${encodedFolderName}`, {
            method: 'POST',
          });

          if (response.ok) {
            favouriteButton.textContent = 'Remove from favourites';
          } else {
            console.error(await response.json());
          }
        } else {
          // Append the current URL path as a query parameter
          const currentPath = encodeURIComponent(window.location.pathname);
          const response = await fetch(`/remove-folder-from-favourites/${encodedFolderName}?currentPath=${currentPath}`, {
            method: 'DELETE',
          });

          // If the current URL path is '/favourites' (folder is being removed from inside the favourites tab), remove the folder from the UI - otherwise only change the button text
          if (response.ok) {
            const data = await response.json();

            favouriteButton.textContent = 'Add to favourites';
            
            if (data === '/favourites') {
              folderContainer.remove();
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

handleFolderFavourites();
markFolderAsDeleted();
setFolderNameInShareModal();
