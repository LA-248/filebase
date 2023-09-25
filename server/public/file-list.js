const fs = require('fs');
const path = require('path');

function displayUploadedFiles() {
  const uploads = path.join(__dirname, '../uploads');
  
  try {
    fs.readdirSync(uploads).forEach((file) => {
      console.log(file);
    });
  } catch (err) {
      console.error("Error reading directory:", err);
  }
}

module.exports.displayUploadedFiles = displayUploadedFiles;
