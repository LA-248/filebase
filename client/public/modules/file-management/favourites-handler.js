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
            method: 'GET',
          });

          if (response.status === 200) {
            favouriteButton.textContent = 'Remove from favourites';
          } else {
            console.error(await response.json());
          }
        } else {
          // Append the current path as a query parameter
          const currentPath = encodeURIComponent(window.location.pathname);
          const response = await fetch(`/remove-from-favourites/${encodedFileName}?currentPath=${currentPath}`, {
            method: 'DELETE',
          });

          const data = await response.json();
          console.log(data);

          // If the current URL path is '/favourites' (file is being removed from inside the favourites tab), remove the file from the UI - otherwise only change the button text
          if (response.status === 200) {
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

handleFileFavourites();
