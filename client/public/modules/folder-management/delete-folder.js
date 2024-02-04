// Toggles UI elements for folder deletion confirmation and cancellation
function confirmFolderDelete() {
  document.addEventListener('click', (event) => {
    if (
      event.target.classList.contains('delete-folder-button') &&
      event.target.textContent === 'Delete'
    ) {
      event.target.textContent = 'Permanently delete';
      event.target.classList.add('confirm-folder-delete');
      event.target.classList.remove('permanently-delete-folder');

      const actionButtonsContainer = event.target.closest(
        '.action-buttons-container'
      );
      let folderCancelConfirmationButton = actionButtonsContainer.querySelector(
        '.folder-cancel-confirmation-button'
      );

      if (!folderCancelConfirmationButton) {
        // Create the cancel button only if it doesn't already exist
        folderCancelConfirmationButton = document.createElement('button');
        folderCancelConfirmationButton.textContent = 'Cancel';
        folderCancelConfirmationButton.className =
          'folder-cancel-confirmation-button';
        actionButtonsContainer.appendChild(folderCancelConfirmationButton);
      } else {
        // If it exists, simply show it
        folderCancelConfirmationButton.style.display = 'block';
      }
    }

    // Handle UI elements if the confirmation is cancelled
    document
      .querySelectorAll('.folder-cancel-confirmation-button')
      .forEach((button) => {
        button.addEventListener('click', (event) => {
          // Navigate up to the nearest .action-buttons-container ancestor
          const container = event.target.closest('.action-buttons-container');

          // Within this container, find the delete button buttons
          const deleteButton = container.querySelector('.delete-folder-button');

          // Modify the styles and classes of the buttons within the same container
          event.target.style.display = 'none';

          // Change the delete button's appearance and text
          deleteButton.classList.add('confirm-folder-delete');
          deleteButton.classList.remove('permanently-delete-folder');
          deleteButton.textContent = 'Delete';
        });
      });
  });
}

// Delete the respective folder when button is clicked
function deleteFolder() {
  document.addEventListener('click', async (event) => {
    if (
      event.target.classList.contains('confirm-folder-delete') &&
      event.target.textContent === 'Permanently delete'
    ) {
      event.target.classList.remove('confirm-folder-delete');
      event.target.classList.add('permanently-delete-folder');
    } else if (event.target.classList.contains('permanently-delete-folder')) {
      // Retrieve relevant elements from the DOM
      const folderContainer = event.target.closest('.folder-container');
      const folderName = event.target
        .closest('.folder-container')
        .querySelector('.uploaded-folder').textContent;
      const encodedFolderName = encodeURIComponent(folderName);

      try {
        // Send DELETE request to the specified endpoint with the name of the file to be deleted
        const response = await fetch(`/delete-folder/${encodedFolderName}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        // Remove the file and button from the UI if operation was successful
        if (response.status === 200) {
          folderContainer.remove();
          console.log(data);
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}

export { confirmFolderDelete, deleteFolder };
