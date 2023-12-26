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

// Upload the file (POST request to backend) when a 'change' event is triggered
async function submitFile() {
  const uploadForm = document.getElementById('upload-form');
  const chooseFile = document.getElementById('choose-file');

  // The 'change' event is fired when a file is selected in the file picker
  chooseFile.addEventListener('change', async (event) => {
    if (event.target.files.length > 0) {
      // Retrieve first selected file (single file upload is being used)
      const file = event.target.files[0];
      // Store name of selected file
      const fileName = file.name;

      const formData = new FormData(uploadForm);
      try {
        const response = await fetch('/upload-file', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data);
        console.log(fileName);
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
      console.log(data);
    } catch (error) {
      console.log('Error:', error);
    }
  });
}

export { openFilePicker, openFolderPicker, submitFile, submitFolder };
