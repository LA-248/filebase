// Add a new file entry to the UI after a file is uploaded
function appendUploadedFileToUI(fileName) {
  const allFiles = document.querySelector('.all-files-section');
  const uploadedFilesContainer = document.querySelector('.uploaded-files-container');

  const fileContainer = document.createElement('div');
  const fileItem = document.createElement('div');
  const uploadedFile = document.createElement('a');
  const actionButtonsContainer = document.createElement('div');
  const downloadButton = document.createElement('button');
  const deleteButton = document.createElement('button');
  const favouriteButton = document.createElement('button');

  fileContainer.className = 'file-container';
  fileItem.className = 'file-item';
  uploadedFile.className = 'uploaded-file';
  uploadedFile.href = `/preview/${fileName}`;
  actionButtonsContainer.className = 'action-buttons-container';
  downloadButton.className = 'download-button';
  deleteButton.className = 'delete-button';
  favouriteButton.className = 'favourite-button';

  uploadedFile.textContent = fileName;
  downloadButton.textContent = 'Download';
  deleteButton.textContent = 'Delete';
  favouriteButton.textContent = 'Add to favourites';

  allFiles.appendChild(fileContainer);
  uploadedFilesContainer.appendChild(fileContainer);
  fileContainer.appendChild(fileItem);
  fileItem.appendChild(uploadedFile);
  fileItem.appendChild(actionButtonsContainer);
  actionButtonsContainer.appendChild(downloadButton);
  actionButtonsContainer.appendChild(deleteButton);
  actionButtonsContainer.appendChild(favouriteButton);
}

function openFilePicker() {
  const uploadFileButton = document.getElementById('upload-file-button');
  const chooseFile = document.getElementById('choose-file');

  // When clicking the 'Upload' button, trigger the click event of the hidden HTML input element which opens the file picker
  uploadFileButton.addEventListener('click', () => {
    chooseFile.click();
  });
}

function openFolderPicker() {
  const uploadFolderButton = document.getElementById('upload-folder-button');
  const chooseFolder = document.getElementById('choose-folder');

  // Open folder picker by triggering hidden HTML element
  uploadFolderButton.addEventListener('click', () => {
    chooseFolder.click();
  });
}

// Handle the file upload process to the server
// Upload the file when a 'change' event is triggered
async function submitFile() {
  const uploadForm = document.getElementById('upload-form');
  const chooseFile = document.getElementById('choose-file');

  // The 'change' event is fired when a file is selected in the file picker
  chooseFile.addEventListener('change', async (event) => {
    if (event.target.files.length > 0) {
      // Retrieve first selected file (single file upload is being used)
      const file = event.target.files[0];

      const formData = new FormData(uploadForm);
      try {
        const response = await fetch('/upload-file', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log(data);

        appendUploadedFileToUI(data.fileName);
      } catch (error) {
        console.log('Error:', error);
      }
    }
  });
}

// Handle upload of folder contents to the backend
async function submitFolder() {
  const chooseFolder = document.getElementById('choose-folder');

  chooseFolder.addEventListener('change', async (event) => {
    // Retrieve all files within the folder
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      console.log(files[i].name);
    }

    // Create a new FormData object to store the files to be uploaded
    const formData = new FormData();

    // Loop through the selected files and append each file to the formData object
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]); 
    }

    // Send formData in the request body, which holds all files to be sent
    try {
      const response = await fetch('/upload-folder', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data.fileNames);

      // Retrieve each file name from the array of file names returned
      for (let i = 0; i < data.fileNames.length; i++) {
        appendUploadedFileToUI(data.fileNames[i]);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  });
}

export { openFilePicker, openFolderPicker, submitFile, submitFolder };
