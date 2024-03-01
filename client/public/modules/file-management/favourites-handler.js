import searchFiles from '../../utilities/file-search.js';
import downloadFile from './download.js';
import { deleteFile } from './delete-file.js';
import { setFileNameInShareModal } from './share-file-modal.js';

export default function handleFileFavourites() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('favourite-button')) {
      const favouriteButton = event.target;
      const fileContainer = event.target.closest('.file-container');
      const fileName = event.target.closest('.file-container').querySelector('.uploaded-file').textContent;
      const encodedFileName = encodeURIComponent(fileName);

      try {
        if (favouriteButton.textContent === 'Add to favourites') {
          const response = await fetch(`/add-to-favourites/${encodedFileName}`, {
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
          const response = await fetch(`/remove-from-favourites/${encodedFileName}?currentPath=${currentPath}`, {
            method: 'DELETE',
          });

          // If the current URL path is '/favourites' (file is being removed from inside the favourites tab), remove the file from the UI - otherwise only change the button text
          if (response.ok) {
            const data = await response.json();

            favouriteButton.textContent = 'Add to favourites';
            
            if (data === '/favourites') {
              fileContainer.remove();
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

searchFiles();

const fileSearch = document.getElementById('search-files-input');
fileSearch.addEventListener('keyup', () => {
  searchFiles();    
});

handleFileFavourites();
deleteFile();

downloadFile();

setFileNameInShareModal();
