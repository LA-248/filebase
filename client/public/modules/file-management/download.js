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
        const response = await fetch(`/download/${fileName}`, {
          method: 'GET',
        });
        // Download file using fetched data
        const blob = await response.blob();
        saveAs(blob, fileName);
      } catch (error) {
        console.error('Error:', error.message);
      }
    });
  });
}

function downloadFileFromPreviewPage() {
  const downloadButton = document.querySelector('.download-button');
  downloadButton.addEventListener('click', async () => {
    // Retrieve relevant elements from the DOM
    const fileName = document.querySelector('.file-name').textContent;
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
  });
}

downloadFileFromPreviewPage();
