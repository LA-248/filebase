// Delete the respective file when button is clicked
export default function deleteFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
      const deleteButton = event.target;
      const fileContainer = event.target.parentElement;
      const fileName = event.target.previousElementSibling.textContent;

      try {
        // Send DELETE request to the specified endpoint
        const response = await fetch(`http://localhost:3000/deleteFile/${fileName}`, {
            method: 'DELETE',
          }
        );
        
        deleteButton.remove();
        fileContainer.remove();

        if (response.ok) {
          console.log(await response.json());
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}
