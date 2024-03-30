import { appendUploadedFileToUI } from './append-file-ui.js';

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
    console.error('Error opening file picker:', error.message);
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
    console.error('Error opening folder picker:', error.message);
  }
}

// Display text to indicate that upload is in progress
function displayUploadInProgressText() {
  const pageHeader = document.querySelector('.page-header');
  let processingUpload = document.querySelector('.processing-upload');

  // Ensure only one instance of the element exists on the page at any given time
  if (!processingUpload) {
    // Create the element if it does not exist
    processingUpload = document.createElement('div');
    processingUpload.className = 'processing-upload';
    const parentElement = pageHeader.parentNode;
    parentElement.insertBefore(processingUpload, pageHeader);
  }

  // Update the text content regardless of whether it was newly created or already existed
  processingUpload.textContent = 'Upload in progress...';

  return processingUpload;
}

// Handle the file upload process to the server
// Upload the file when a 'change' event is triggered
function submitFile() {
  const uploadForm = document.getElementById('upload-form');
  const chooseFile = document.getElementById('choose-file');

  // The 'change' event is fired when a file is selected in the file picker
  chooseFile.addEventListener('change', async (event) => {
    if (event.target.files.length > 0) {
      const formData = new FormData(uploadForm);
      const folderName = sessionStorage.getItem('currentFolder');
      formData.append('folderName', folderName);

      const processingUpload = displayUploadInProgressText();

      try {
        const response = await fetch('/upload-file', {
          method: 'POST',
          body: formData,
        });

        // If response is ok, append the file to the UI and display a success message
        if (response.ok) {
          const data = await response.json();
          appendUploadedFileToUI(data.fileName, data.fileUuid);

          processingUpload.textContent = 'Upload successful!';
          setTimeout(() => {
            processingUpload.remove();
          }, 5000);
        } else {
          processingUpload.textContent = 'Error with upload, please try again';
          throw new Error('Server responded with an error: ' + response.status);
        }
      } catch (error) {
        console.error('Error:', error.message);
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

    for (let i = 0; i < files.length; i++) {
      console.log(files[i].name);
    }

    // Create a new FormData object to store the files to be uploaded
    const formData = new FormData();

    // Retrieve folder name from session storage and append it to formData
    const folderName = sessionStorage.getItem('currentFolder');

    // Loop through the selected files and append each file to the formData object
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      formData.append('folderName' + i, folderName);
    }

    const processingUpload = displayUploadInProgressText();

    // Send formData in the request body, which holds all files to be sent
    try {
      const response = await fetch('/upload-folder', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Retrieve each file name from the array of file names returned
        for (let i = 0; i < data.fileNames.length; i++) {
          appendUploadedFileToUI(data.fileNames[i]);

          processingUpload.textContent = 'Upload successful!';
          setTimeout(() => {
            processingUpload.remove();
          }, 5000);
        }
      } else {
        throw new Error('Server responded with an error: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}

export { openFilePicker, openFolderPicker, submitFile, submitFolder };
