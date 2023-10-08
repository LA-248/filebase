import fetchFiles from './fetch-files.js';

// This counter is attached to the 'delete-button' HTML element and incremented each time a new file is uploaded
let deleteButtonIdCounter = -1;

export default async function displayFiles() {
  try {
    const uploadedFiles = await fetchFiles();
    const allUploadedFiles = document.querySelector('.uploaded-files-container');

    uploadedFiles.forEach(file => {
      const uploadedFile = document.createElement('div');
      const deleteFileButton = document.createElement('button');

      deleteFileButton.className = 'delete-button';
      deleteFileButton.textContent = 'Delete';
      deleteFileButton.dataset.id = (deleteButtonIdCounter += 1);

      uploadedFile.className = 'uploaded-file';
      uploadedFile.textContent = file.fileName;

      uploadedFile.append(deleteFileButton);
      allUploadedFiles.append(uploadedFile);
    });
  } catch (error) {
    console.error('An error occurred: ', error);
  }
}