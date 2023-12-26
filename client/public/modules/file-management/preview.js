export default function previewFile() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('uploaded-file')) {
      const fileName = event.target.textContent;

      try {
        await fetch(`/preview/${fileName}`, {
          method: 'GET',
        });
      } catch (error) {
        console.log('Error:', error.message);
      }
    }
  });
}
