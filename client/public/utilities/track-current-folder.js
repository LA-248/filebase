// Track which folder the user is currently in and save its name to session storage
export default function trackCurrentFolder() {
  // Function to set the current folder based on the URL
  const setCurrentFolder = () => {
    if (window.location.href.includes('folder')) {
      // Get the folder name from the page
      const folderName = document.querySelector('.page-header').textContent;
      sessionStorage.setItem('currentFolder', folderName);
    } else {
      sessionStorage.setItem('currentFolder', 'not-in-folder');
    }
  };

  // Listen for click events that might change the folder context
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('uploaded-folder')) {
      // Direct click on an element that represents a folder
      const folderName = event.target.textContent;
      sessionStorage.setItem('currentFolder', folderName);
    } else {
      // Delay the folder check to capture potential asynchronous updates to the page's URL or content
      setTimeout(setCurrentFolder, 0);
    }
  });

  // Check the current folder status immediately on script load
  setCurrentFolder();
}

