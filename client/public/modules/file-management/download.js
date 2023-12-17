export default function downloadFile() {
  const downloadButtons = document.querySelectorAll('.download-button');
  downloadButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      // Retrieve relevant elements from the DOM
      const downloadButton = event.target;
      const fileName = downloadButton
        .closest('.file-container')
        .querySelector('.uploaded-file').textContent;

      try {
        // Send GET request to the specified endpoint with the name of the file to be downloaded
        const response = await fetch(
          `http://localhost:3000/download/${fileName}`,
          {
            method: 'GET',
          }
        );
        // Download file using fetched data
        const blob = await response.blob();
        saveAs(blob, fileName);
      } catch (error) {
        console.error('Error:', error.message);
      }
    });
  });
}
