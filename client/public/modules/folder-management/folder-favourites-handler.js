import { markFolderAsDeleted } from '../folder-management/delete-folder.js';

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
          const response = await fetch(`/folders/${encodedFolderName}/favourite`, {
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
          const response = await fetch(`/folders/${encodedFolderName}/favourite?currentPath=${currentPath}`, {
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

// Call this function here so its functionality works on both the homepage and favourites page
markFolderAsDeleted();
