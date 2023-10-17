import fetchFiles from './fetch-files.js';

export default async function displayFiles() {
  try {
    const uploadedFiles = await fetchFiles();
    const allUploadedFiles = document.querySelector('.uploaded-files-container');

    uploadedFiles.forEach(file => {
      const fileContainer = document.createElement('div');
      const uploadedFile = document.createElement('div');
      const deleteFileButton = document.createElement('button');

      fileContainer.className = 'file-container';

      uploadedFile.className = 'uploaded-file';
      uploadedFile.textContent = file.fileName;

      deleteFileButton.className = 'delete-button';
      deleteFileButton.textContent = 'Delete';

      fileContainer.append(uploadedFile);
      fileContainer.append(deleteFileButton);
      allUploadedFiles.append(fileContainer);
    });
  } catch (error) {
    console.error('An error occurred: ', error);
  }
}
