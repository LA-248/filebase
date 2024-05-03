import { appendUploadedItemToUI } from '../ui/append-item-ui.js';
import { displayUploadInProgressText } from './upload.js';

// Set up behaviour for the Dropbox Chooser
const options = {
  // Called when a user selects an item in the Chooser
  success: async function(files) {
    const fileData = [];
    const rootFolder = sessionStorage.getItem('rootFolder');
    const folderName = sessionStorage.getItem('currentFolder');

    for (let i = 0; i < files.length; i++) {
      fileData.push({
        id: files[i].id,
        name: files[i].name,
        link: files[i].link,
        bytes: files[i].bytes,
        rootFolder: rootFolder,
        folderName: folderName,
      });
    }

    const processingUpload = displayUploadInProgressText();

    // Send the data from the files imported from Dropbox to the backend, to be stored in both the database and S3
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

        // Retrieve each file name from the array of file names returned, so it can be used to be displayed in the UI
        for (let i = 0; i < data.fileNames.length; i++) {
          appendUploadedItemToUI(data.fileNames[i], 'file', 'File');
        }
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
  multiselect: true,
  folderselect: false,
};

// Trigger Dropbox Chooser
export default function setupDropboxChooser() {
  const dropboxChooserButton = document.querySelector('.dropbox-chooser-button');
  dropboxChooserButton.addEventListener('click', () => {
    Dropbox.choose(options);
  });
}
