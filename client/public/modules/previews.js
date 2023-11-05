export default function previewFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('uploaded-file')) {
      const fileName = event.target.textContent;

      try {
        const response = await fetch(`http://localhost:3000/download/${fileName}`, {
          method: 'GET',
        });
        const blob = await response.blob();
    
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
    
        // Set the src of the image to the Blob URL
        document.getElementById('file-preview').src = url;
      } catch (error) {
        console.log('Error:', error.message);
      }
    }
  });
};