// Delete the respective file when button is clicked
export default function deleteFile() {
  const deleteButton = document.querySelector('.delete-button');

  deleteButton.addEventListener('click', async () => {
    try {
      // Send DELETE request to the specified endpoint
      await fetch('http://localhost:3000/deleteFile', {
      method: 'DELETE',
    });
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}
