export default function downloadFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('download-file-button')) {
      const downloadButton = event.target;
      const fileName = downloadButton.closest('.file-container').querySelector('.uploaded-file').textContent;

      try {
        const response = await fetch(`/files/${fileName}/download`, {
          method: 'GET',
        });

        if (response.ok) {
          // Retrieve presigned S3 URL
          const fileUrl = await response.json();

          // Create a temporary anchor element for downloading, this is so only one download is triggered
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
