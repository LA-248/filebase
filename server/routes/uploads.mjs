import express from 'express';
const router = express.Router();

// Configures how uploaded files will be stored (destination and name)
import multer from 'multer';
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// HTTP GET request to the home page - when accessed, a specific HTML file is served
router.get('/', (req, res) => {
  res.sendFile(
    'C:\\Users\\lucaa\\Dropbox\\Code\\Projects\\cloud-storage\\client\\public\\index.html'
  );
});

// Create a POST route to handle the file upload and return a success message on the upload
router.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully!');
});

export default router;
