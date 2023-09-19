function openFilePicker() {
  const uploadFileButton = document.getElementById('upload-file-button');
  const chooseFile = document.getElementById('choose-file');

  // When clicking the 'Upload' button, trigger the click event of the hidden HTML input element which opens the file picker
  uploadFileButton.addEventListener('click', () => {
    chooseFile.click();
  });
}

function submitFile() {
  const uploadForm = document.getElementById('upload-form');
  const chooseFile = document.getElementById('choose-file');

  // Submit the form (therefore uploading the file) when a 'change' event is triggered
  // The 'change' event is fired when a file is selected in the file picker
  chooseFile.addEventListener('change', (event) => {
    // Check if at least one file is selected
    if (event.target.files.length > 0) {
      uploadForm.submit();
    }
  });
}

export { openFilePicker, submitFile };
