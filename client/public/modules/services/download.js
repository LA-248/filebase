import handleDisplayingError from '../ui/error-handler.js';

export default function downloadFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('download-file-button')) {
      let fileName;
      const currentPath = window.location.pathname;
      const downloadButton = event.target;

      // File name needs to be retrieved differently from the DOM depending on which page the user is on
      if (currentPath.includes('/home') || currentPath.includes('/favourites') || currentPath.includes('/folders')) {
        fileName = downloadButton.closest('.file-container').querySelector('.uploaded-file').textContent;
      } else if (currentPath.includes('/files')) {
        fileName = document.querySelector('.file-name').textContent;
      }

      try {
        const response = await fetch(`/files/${fileName}/download`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message);
        }
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
      } catch (error) {
        handleDisplayingError(error, downloadButton, 'Download');
      }
    }
  });
}

downloadFile();
