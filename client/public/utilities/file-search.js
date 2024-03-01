export default function searchFiles() {
  const searchBar = document.getElementById('search-files-input')
    .value.toUpperCase();
  const uploadedFileContainers = document.querySelectorAll('.file-container');
  const uploadedFolderContainers = document.querySelectorAll('.folder-container');

  for (let i = 0; i < uploadedFileContainers.length; i++) {
    // Find the anchor tag within the file-item class
    const fileAnchor = uploadedFileContainers[i].querySelector('a.uploaded-file');

    if (fileAnchor) {
      const textValue = fileAnchor.textContent || fileAnchor.innerText;

      if (textValue.toUpperCase().indexOf(searchBar) > -1) {
        // Show the file-item
        uploadedFileContainers[i].style.display = '';
      } else {
        // Hide the file-item
        uploadedFileContainers[i].style.display = 'none';
      }
    }
  }

  for (let i = 0; i < uploadedFolderContainers.length; i++) {
    const fileAnchor = uploadedFolderContainers[i].querySelector('a.uploaded-folder');

    if (fileAnchor) {
      const textValue = fileAnchor.textContent || fileAnchor.innerText;

      if (textValue.toUpperCase().indexOf(searchBar) > -1) {
        uploadedFolderContainers[i].style.display = '';
      } else {
        uploadedFolderContainers[i].style.display = 'none';
      }
    }
  }
}
