export default function downloadFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('download-button')) {
      // Retrieve relevant elements from the DOM
      const downloadButton = event.target;
      const fileName = downloadButton
        .closest('.file-container')
        .querySelector('.uploaded-file').textContent;
      console.log(fileName);

      try {
        // Send GET request to the specified endpoint with the name of the file to be downloaded
        const response = await fetch(`/download/${fileName}`, {
          method: 'GET',
        });

        if (response.ok) {
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
        } else {
          console.error(await response.json());
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
}
