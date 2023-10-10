// Delete the respective file when button is clicked
export default function deleteFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
      // Retrieve relevant elements from the DOM
      const deleteButton = event.target;
      const fileContainer = event.target.parentElement;
      const fileName = event.target.previousElementSibling.textContent;
      const successMessage = document.querySelector('.success-message');
      // Encode file name in case it contains special characters
      const encodedFileName = encodeURIComponent(fileName);

      try {
        // Send DELETE request to the specified endpoint with the name of the file to be deleted
        const response = await fetch(`http://localhost:3000/deleteFile/${encodedFileName}`, {
            method: 'DELETE',
          }
        );
        const data = await response.json();
        successMessage.textContent = data;

        // Display success message upon deleting a file
        function displaySuccessMessage(event) {
          if (event.target.classList.contains('delete-button')) {
            successMessage.style.display = 'flex';
          }
        }

        displaySuccessMessage(event);
        
        // Remove success message after 4 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 4000);

        if (response.ok) {
          // Remove the file and button from the UI if operation was successful
          deleteButton.remove();
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
