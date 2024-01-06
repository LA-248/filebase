export default function createFolder() {
  const createFolderButton = document.querySelector('.create-folder');

  createFolderButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/create-folder', {
        method: 'POST',
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}
