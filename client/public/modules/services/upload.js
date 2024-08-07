import displayUploadInProgressText from '../utilities/upload-progress-indicator.js';
import { appendUploadedItemToUI } from '../ui/append-item-ui.js';

function openFilePicker() {
  const uploadFileButton = document.getElementById('upload-file-button');
  const chooseFile = document.getElementById('choose-file');

  try {
    // When clicking the 'Upload' button, trigger the click event of the hidden HTML input element which opens the file picker
    uploadFileButton.addEventListener('click', () => {
      chooseFile.click();
      // After handling the file upload, reset the file input's value
      chooseFile.value = '';
    });
  } catch (error) {
    console.error('Error opening file picker');
  }
}

function openFolderPicker() {
  const uploadFolderButton = document.getElementById('upload-folder-button');
  const chooseFolder = document.getElementById('choose-folder');

  try {
    // Open folder picker by triggering hidden HTML element
    uploadFolderButton.addEventListener('click', () => {
      chooseFolder.click();
    });
  } catch (error) {
    console.error('Error opening folder picker');
  }
}

// Handle the file upload process to the server
// Upload the file when a 'change' event is triggered
function submitFile() {
  const uploadForm = document.getElementById('upload-form');
  const chooseFile = document.getElementById('choose-file');

  // The 'change' event is fired when a file is selected in the file picker
  chooseFile.addEventListener('change', async (event) => {
    if (event.target.files.length > 0) {
      // Use formData to package the file and additional form data to then be sent to the server
      const formData = new FormData(uploadForm);
      // Send folder data to backend to indicate the file's location within the folder structure
      const folderName = sessionStorage.getItem('currentFolder');
      const rootFolder = sessionStorage.getItem('rootFolder');
      formData.append('folderName', folderName);
      formData.append('rootFolder', rootFolder);

      const processingUpload = displayUploadInProgressText();

      try {
        const response = await fetch('/files', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message);
        }
        // If response is ok, append the file to the UI and display a success message
        const data = await response.json();
        appendUploadedItemToUI(data.fileName, 'file', 'File');

        processingUpload.textContent = 'Upload successful!';
        setTimeout(() => {
          processingUpload.remove();
        }, 5000);
      } catch (error) {
        processingUpload.textContent = error.message;
        setTimeout(() => {
          processingUpload.remove();
        }, 5000);
      }
    }
  });
}

// Handle upload of folder contents to the backend
function submitFolder() {
  const chooseFolder = document.getElementById('choose-folder');

  chooseFolder.addEventListener('change', async (event) => {
    // Retrieve all files within the folder
    const files = event.target.files;

    // Create a new FormData object to store the files to be uploaded
    const formData = new FormData();

    // Send folder data to backend to indicate the folder's location within the folder structure
    const rootFolder = sessionStorage.getItem('rootFolder');
    const folderName = sessionStorage.getItem('currentFolder');

    // Loop through the selected files and append each file to the formData object
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      formData.append('rootFolder' + i, rootFolder);
      formData.append('folderName' + i, folderName);
    }
    const processingUpload = displayUploadInProgressText();

    // Send formData in the request body, which holds all files to be sent
    try {
      const response = await fetch('/files/multiple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
      const data = await response.json();

      // Retrieve each file name from the array of file names returned - used for appending each file to the UI
      for (let i = 0; i < data.fileNames.length; i++) {
        appendUploadedItemToUI(data.fileNames[i], 'file', 'File');
      }

      processingUpload.textContent = 'Upload successful!';
      setTimeout(() => {
        processingUpload.remove();
      }, 5000);
    } catch (error) {
      processingUpload.textContent = error.message;
      setTimeout(() => {
        processingUpload.remove();
      }, 5000);
    }
  });
}

export {
  openFilePicker,
  openFolderPicker,
  submitFile,
  submitFolder,
  displayUploadInProgressText,
};
