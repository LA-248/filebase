// Delete the respective folder when button is clicked
export default function deleteFolder() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-folder-button')) {
      // Retrieve relevant elements from the DOM
      const deleteButton = event.target;
      const folderContainer = event.target.closest('.folder-container');
      const folderName = event.target.closest('.folder-container').querySelector('.uploaded-folder').textContent;
      const encodedFolderName = encodeURIComponent(folderName);

      try {
        // Send DELETE request to the specified endpoint with the name of the file to be deleted
        const response = await fetch(`/delete-folder/${encodedFolderName}`, {
            method: 'DELETE',
          }
        );
        const data = await response.json();

        // Remove the file and button from the UI if operation was successful
        if (response.status === 200) {
          deleteButton.remove();
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
