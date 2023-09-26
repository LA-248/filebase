import fetchFiles from './fetch-files.js';

export default async function displayFiles() {
  try {
    const uploadedFiles = await fetchFiles();
    const allUploadedFiles = document.querySelector('.uploaded-files-container');
    console.log(uploadedFiles);

    uploadedFiles.forEach(file => {
      const uploadedFile = document.createElement('div');
      uploadedFile.className = 'uploaded-file';
      uploadedFile.textContent = file;
      allUploadedFiles.append(uploadedFile);
    });

  } catch (error) {
    console.error("An error occurred: ", error);
  }
}
