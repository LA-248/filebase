/*
// Toggles UI elements for file deletion confirmation and cancellation
function confirmFileDelete() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-file-button')) {
      event.target.textContent = 'Permanently delete';
      event.target.classList.add('confirm-file-delete');
      event.target.classList.remove('permanently-delete-file');

      const downloadButton = event.target.previousElementSibling;
      const favouriteButton = event.target.nextElementSibling;
      favouriteButton.style.display = 'none';
      downloadButton.style.display = 'none';

      const actionButtonsContainer = event.target.closest(
        '.action-buttons-container'
      );
      let cancelConfirmationButton = actionButtonsContainer.querySelector(
        '.cancel-confirmation-button'
      );

      if (!cancelConfirmationButton) {
        // Create the cancel button only if it doesn't already exist
        cancelConfirmationButton = document.createElement('button');
        cancelConfirmationButton.textContent = 'Cancel';
        cancelConfirmationButton.className = 'cancel-confirmation-button';
        actionButtonsContainer.appendChild(cancelConfirmationButton);
      } else {
        // If it exists, simply show it
        cancelConfirmationButton.style.display = 'block';
      }
    }

    document
      .querySelectorAll('.cancel-confirmation-button')
      .forEach((button) => {
        button.addEventListener('click', (event) => {
          // Navigate up to the nearest .action-buttons-container ancestor
          const container = event.target.closest('.action-buttons-container');

          // Within this container, find the individual buttons
          const downloadButton = container.querySelector('.download-button');
          const favouriteButton = container.querySelector('.favourite-button');
          const deleteButton = container.querySelector('.delete-file-button');

          // Modify the styles and classes of the buttons within the same container
          event.target.style.display = 'none';

          favouriteButton.style.display = 'block';
          downloadButton.style.display = 'block';

          // Change the delete button's appearance and text
          deleteButton.classList.add('confirm-file-delete');
          deleteButton.classList.remove('permanently-delete-file');
          deleteButton.textContent = 'Delete';
        });
      });
  });
}
*/

// Delete the respective file when button is clicked
function deleteFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-file-button')) {
      // Retrieve relevant elements from the DOM
      const fileContainer = event.target.closest('.file-container');
      const fileName = event.target
        .closest('.file-container')
        .querySelector('.uploaded-file').textContent;
      const encodedFileName = encodeURIComponent(fileName);

      try {
        // Send DELETE request to the specified endpoint with the name of the file to be deleted
        const response = await fetch(`/delete-file/${encodedFileName}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        // Remove the file and button from the UI if operation was successful
        if (response.ok) {
          fileContainer.remove();
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

export { deleteFile };
