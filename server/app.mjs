import express from 'express';
import upload from './routes/uploads.mjs';
import getFiles from './routes/get-files.mjs';
import deleteFile from './routes/delete-file-handler.mjs';

const app = express();
const port = 3000;

// Attach route handlers
app.use('/', upload);
app.use('/', getFiles);
app.use('/', deleteFile);

app.use(express.static('../client/public'));

// HTTP GET request to the home page - when accessed, a specific HTML file is served
app.get('/', (req, res) => {
  res.sendFile(
    'C:\\Users\\lucaa\\Dropbox\\Code\\Projects\\cloud-storage\\client\\public\\index.html'
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
