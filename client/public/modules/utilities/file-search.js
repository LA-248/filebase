// Filter and display files and folders based on user input
function searchFiles() {
  const searchBar = document.getElementById('search-files-input').value.toUpperCase();
  const uploadedFileContainers = document.querySelectorAll('.file-container');
  const uploadedFolderContainers = document.querySelectorAll('.folder-container');

  // Loop through each file container to search for matches
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

  // Loop through each folder container to search for matches
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

// Handle search events
export default function handleSearches() {
  const fileSearch = document.getElementById('search-files-input');
  // Trigger the search function on 'keyup' event
  fileSearch.addEventListener('keyup', () => {
    searchFiles();
  });
}

handleSearches();
