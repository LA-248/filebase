function retrieveFolderElements(event) {
  // Retrieve relevant elements from the DOM
  const folderContainer = event.target.closest('.folder-container');
  const folderName = event.target.closest('.folder-container').querySelector('.uploaded-folder').textContent;
  const encodedFolderName = encodeURIComponent(folderName);

  return { folderContainer, encodedFolderName };
}

// Mark folder as deleted
function markFolderAsDeleted() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-folder-button')) {
      const { folderContainer, encodedFolderName } = retrieveFolderElements(event);

      try {
        const response = await fetch(`/delete-folder/${encodedFolderName}`, {
          method: 'POST',
        });

        // Remove the file and button from the UI if operation was successful
        if (response.ok) {
          folderContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

// Restore a folder that was marked as deleted
function restoreFolder() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('restore-folder-button')) {
      const { folderContainer, encodedFolderName } = retrieveFolderElements(event);

      try {
        const response = await fetch(`/restore-folder/${encodedFolderName}`, {
          method: 'POST',
        });

        // Remove the file and button from the UI if operation was successful
        if (response.ok) {
          folderContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

// Permanently delete a folder
function permanentlyDeleteFolder() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('permanently-delete-folder-button')) {
      const { folderContainer, encodedFolderName } = retrieveFolderElements(event);

      try {
        // Send DELETE request to the specified endpoint with the name of the folder to be deleted
        const response = await fetch(
          `/permanently-delete-folder/${encodedFolderName}`,
          {
            method: 'DELETE',
          }
        );
        // Remove the folder and button from the UI if operation was successful
        if (response.ok) {
          folderContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

restoreFolder();
permanentlyDeleteFolder();

export { markFolderAsDeleted };
