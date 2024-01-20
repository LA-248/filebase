// Track which folder the user is currently in and save its name to session storage
export default function trackCurrentFolder() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('uploaded-folder')) {
      const folderName = event.target.textContent;
      sessionStorage.setItem('currentFolder', folderName);
    }
  });
  
  if (!window.location.href.includes('folder')) {
    sessionStorage.setItem('currentFolder', 'not-in-folder');
  }
}
