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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
