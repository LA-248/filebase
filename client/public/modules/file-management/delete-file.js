// Delete the respective file when button is clicked
export default function deleteFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-file-button')) {
      // Retrieve relevant elements from the DOM
      const fileContainer = event.target.closest('.file-container');
      const fileName = event.target.closest('.file-container').querySelector('.uploaded-file').textContent;
      const encodedFileName = encodeURIComponent(fileName);

      try {
        // Send DELETE request to the specified endpoint with the name of the file to be deleted
        const response = await fetch(`/delete-file/${encodedFileName}`, {
            method: 'DELETE',
          }
        );

        // Remove the file and button from the UI if operation was successful
        if (response.status === 200) {
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
