import deleteFile from './delete-file.js';
import downloadFile from './download.js';

export default function handleFileFavourites() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('favourite-button')) {
      const favouriteButton = event.target;
      const fileName = event.target.closest('.file-container').querySelector('.uploaded-file').textContent;
      const encodedFileName = encodeURIComponent(fileName);

      try {
        if (favouriteButton.textContent === 'Add to favourites') {
          const response = await fetch(`/add-to-favourites/${encodedFileName}`, {
            method: 'GET',
          });

          if (response.status === 200) {
            favouriteButton.textContent = 'Remove from favourites';
          } else {
            console.error(await response.json());
          }
        } else {
          const response = await fetch(`/remove-from-favourites/${encodedFileName}`, {
            method: 'DELETE',
          });

          if (response.status === 200) {
            favouriteButton.textContent = 'Add to favourites';
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

handleFileFavourites();

downloadFile();
deleteFile();
