// Track which folder the user is currently in and save its name to session storage
function trackRootFolder() {
  // Function to set the current folder based on the URL
  const setRootFolder = () => {
    if (window.location.href.includes('home')) {
      document.addEventListener('click', (event) => {
        if (event.target.classList.contains('uploaded-folder')) {
          const rootFolderName = event.target.textContent;
          sessionStorage.setItem('rootFolder', rootFolderName);
        }
      });

      sessionStorage.setItem('rootFolder', null);
    }

    if (window.location.href.includes('shared') || window.location.href.includes('favourites') || window.location.href.includes('deleted')) {
      document.addEventListener('click', (event) => {
        if (event.target.classList.contains('uploaded-folder')) {
          const rootFolderName = event.target.textContent;
          const typeSubtext = event.target.closest('.folder-item').querySelector('.type-subtext').textContent;

          // Need to check if the folder's subtext includes 'in' (e.g. in Documents), if it does, it means it's a subfolder, set the rootFolder value to null
          if (typeSubtext.includes('in')) {
            sessionStorage.setItem('rootFolder', null);
          } else {
            sessionStorage.setItem('rootFolder', rootFolderName);
          }
        }
      });
    }
  };

  // Check the root folder status immediately on script load
  setRootFolder();
}

trackRootFolder();
