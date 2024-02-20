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
      // Retrieve presigned S3 URL
      const fileUrl = await response.json();

      // Create a temporary anchor element for downloading
      const tempLink = document.createElement('a');
      document.body.appendChild(tempLink);
      tempLink.href = fileUrl;
      tempLink.setAttribute('download', fileName);
      // Programmatically click the link to trigger the download
      tempLink.click();
      document.body.removeChild(tempLink);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}

downloadFileFromPreviewPage();
