export default function downloadFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('download-button')) {
      // Retrieve relevant elements from the DOM
      const downloadButton = event.target;
      const fileName = downloadButton.closest('.file-container').querySelector('.uploaded-file').textContent;

      try {
        // Send GET request to the specified endpoint with the name of the file to be downloaded
        const response = await fetch(`http://localhost:3000/download/${fileName}`, {
            method: 'GET',
          }
        );
        const blob = await response.blob();
        saveAs(blob, fileName);

      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}
