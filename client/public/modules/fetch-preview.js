export default function previewFile() {
  const filePreview = document.getElementById('file-preview');

  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('uploaded-file')) {
      const fileName = event.target.textContent;

      try {
        const response = await fetch(`http://localhost:3000/preview/${fileName}`, {
          method: 'GET',
        });
        const blob = await response.blob();

        // Revoke the previous Blob URL if it exists
        if (filePreview.src) {
          URL.revokeObjectURL(filePreview.src);
        }
    
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
        // Set the src of the image to the Blob URL
        filePreview.src = url;
      } catch (error) {
        console.log('Error:', error.message);
      }
    } else {
      filePreview.src = '';
    }
  });
};