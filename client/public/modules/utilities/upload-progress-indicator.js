// Display text to indicate that upload is in progress
export default function displayUploadInProgressText() {
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
