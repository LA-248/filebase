export default async function fetchFiles() {
  try {
    const response = await fetch('http://localhost:3000/getFiles', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const uploadedFiles = data[0].indexedFileList;
    console.log(uploadedFiles);
    return uploadedFiles;
  } catch (error) {
    console.error('Error:', error.message);
  }
}