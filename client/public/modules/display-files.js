import fetchFiles from './fetch-files.js';

async function displayAllFiles() {
  try {
    const uploadedFiles = await fetchFiles();
    const allUploadedFiles = document.querySelector('.uploaded-files-container');

    uploadedFiles.forEach(file => {
      const fileContainer = document.createElement('div');
      const uploadedFile = document.createElement('div');
      const actionButtonsContainer = document.createElement('div');
      const downloadButton = document.createElement('button');
      const deleteFileButton = document.createElement('button');

      fileContainer.className = 'file-container';

      uploadedFile.className = 'uploaded-file';
      uploadedFile.textContent = file.fileName;

      actionButtonsContainer.className = 'action-buttons-container';
      
      downloadButton.className = 'download-button';
      downloadButton.textContent = 'Download';

      deleteFileButton.className = 'delete-button';
      deleteFileButton.textContent = 'Delete';

      fileContainer.append(uploadedFile);
      fileContainer.append(actionButtonsContainer);
      actionButtonsContainer.append(downloadButton);
      actionButtonsContainer.append(deleteFileButton);
      allUploadedFiles.append(fileContainer);
    });
  } catch (error) {
    console.error('An error occurred: ', error);
  }
}

function appendUploadedFile(file) {
  try {
    const allUploadedFiles = document.querySelector('.uploaded-files-container');

    const fileContainer = document.createElement('div');
    const uploadedFile = document.createElement('div');
    const actionButtonsContainer = document.createElement('div');
    const downloadButton = document.createElement('button');
    const deleteFileButton = document.createElement('button');

    fileContainer.className = 'file-container';

    uploadedFile.className = 'uploaded-file';
    uploadedFile.textContent = file;

    actionButtonsContainer.className = 'action-buttons-container';
      
    downloadButton.className = 'download-button';
    downloadButton.textContent = 'Download';

    deleteFileButton.className = 'delete-button';
    deleteFileButton.textContent = 'Delete';

    fileContainer.append(uploadedFile);
    fileContainer.append(actionButtonsContainer);
    actionButtonsContainer.append(downloadButton);
    actionButtonsContainer.append(deleteFileButton);
    allUploadedFiles.append(fileContainer);
  } catch (error) {
    console.error('An error occurred: ', error);
  }
}

export { displayAllFiles, appendUploadedFile };
