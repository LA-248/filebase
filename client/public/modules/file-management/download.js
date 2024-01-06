export default function downloadFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('download-button')) {
      // Retrieve relevant elements from the DOM
      const downloadButton = event.target;
      const fileName = downloadButton.closest('.file-container').querySelector('.uploaded-file').textContent;
      console.log(fileName);

      try {
        // Send GET request to the specified endpoint with the name of the file to be downloaded
        const response = await fetch(`/download/${fileName}`, {
          method: 'GET',
        });
        // Download file using fetched data
        const blob = await response.blob();
        saveAs(blob, fileName);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  });
}
