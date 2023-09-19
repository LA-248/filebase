const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  res.sendFile('C:\\Users\\lucaa\\Dropbox\\Code\\Projects\\cloud-storage\\client\\public\\index.html')
});

router.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully!');
});

module.exports = router;
