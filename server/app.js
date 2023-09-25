const express = require('express');
const app = express();
const upload = require('./routes/upload');
const { displayUploadedFiles } = require('./public/file-list.js');
const port = 3000;

app.use('/', upload);

app.use(express.static('../client/public'));

displayUploadedFiles();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
