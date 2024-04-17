function retrieveFileElements(event) {
  // Retrieve relevant elements from the DOM
  const fileContainer = event.target.closest('.file-container');
  const fileName = event.target.closest('.file-container').querySelector('.uploaded-file').textContent;
  const encodedFileName = encodeURIComponent(fileName);

  return { fileContainer, encodedFileName };
}

// Mark file as deleted
function markFileAsDeleted() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-file-button')) {
      const { fileContainer, encodedFileName } = retrieveFileElements(event);

      try {
        const response = await fetch(`/files/${encodedFileName}`, {
          method: 'DELETE',
        });

        // Remove the file and button from the UI if operation was successful
        if (response.ok) {
          fileContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

// Restore a file that was marked as deleted
function restoreFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('restore-file-button')) {
      const { fileContainer, encodedFileName } = retrieveFileElements(event);

      try {
        const response = await fetch(`/files/${encodedFileName}/restore`, {
          method: 'PUT',
        });

        // Remove the file and button from the UI if operation was successful
        if (response.ok) {
          fileContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

// Permanently delete the respective file when button is clicked
function permanentlyDeleteFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('permanently-delete-file-button')) {
      const { fileContainer, encodedFileName } = retrieveFileElements(event);

      try {
        // Send DELETE request to the specified endpoint with the name of the file to be deleted
        const response = await fetch(`/files/${encodedFileName}/permanent`, {
          method: 'DELETE',
        });

        // Remove the file and button from the UI if operation was successful
        if (response.ok) {
          fileContainer.remove();
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

restoreFile();
permanentlyDeleteFile();

export { markFileAsDeleted };
