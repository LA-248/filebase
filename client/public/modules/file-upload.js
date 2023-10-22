import { appendUploadedFile } from './display-files.js';

function openFilePicker() {
  const uploadFileButton = document.getElementById('upload-file-button');
  const chooseFile = document.getElementById('choose-file');

  // When clicking the 'Upload' button, trigger the click event of the hidden HTML input element which opens the file picker
  uploadFileButton.addEventListener('click', () => {
    chooseFile.click();
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
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data);
        console.log(fileName);

        appendUploadedFile(fileName);
      } catch (error) {
        console.log('Error:', error);
      }
    }
  });
}

export { openFilePicker, submitFile };
