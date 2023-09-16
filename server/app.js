const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile('C:\\Users\\lucaa\\Dropbox\\Code\\Projects\\cloud-storage\\client\\index.html');
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully!');
});
