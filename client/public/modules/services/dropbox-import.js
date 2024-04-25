import { appendUploadedItemToUI } from '../ui/append-item-ui.js';
import { displayUploadInProgressText } from './upload.js';

// Set up behaviour for the Dropbox Chooser
const options = {
  // Called when a user selects an item in the Chooser
  success: async function (files) {
    const folderName = sessionStorage.getItem('currentFolder');
    const fileData = {
      id: files[0].id,
      name: files[0].name,
      link: files[0].link,
      bytes: files[0].bytes,
      folderName: folderName,
    };

    const processingUpload = displayUploadInProgressText();

    // Send the data of the file imported from Dropbox to the backend so it can be stored in the database and S3
    try {
      const response = await fetch('/files/dropbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileData),
      });
  
      if (response.ok) {
        const data = await response.json();
        appendUploadedItemToUI(data.fileName, 'file', 'File');
  
        processingUpload.textContent = 'Upload successful!';
        setTimeout(() => {
          processingUpload.remove();
        }, 5000);
      } else {
        processingUpload.textContent = await response.json();
        throw new Error('Server responded with an error: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  },
  linkType: 'direct',
  multiselect: false,
  folderselect: false,
};

// Trigger Dropbox Chooser
export default function setupDropboxChooser() {
  const dropboxChooserButton = document.querySelector('.dropbox-chooser-button');
  dropboxChooserButton.addEventListener('click', async () => {
    Dropbox.choose(options);
  });
}
