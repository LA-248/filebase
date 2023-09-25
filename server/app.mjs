import express from 'express';
import upload from './routes/upload.mjs';
import getFiles from './routes/get-files.mjs';

const app = express();
const port = 3000;

app.use('/', upload);
app.use('/', getFiles);

app.use(express.static('../client/public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
