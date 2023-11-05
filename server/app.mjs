const app = express();
const port = 3000;

import express from 'express';
import uploads from './routes/uploads.mjs';
import getFiles from './routes/get-files.mjs';
import deleteFile from './routes/delete-file-handler.mjs';
import downloads from './routes/downloads.mjs';

// Attach routes
app.use('/', uploads);
app.use('/', getFiles);
app.use('/', deleteFile);
app.use('/', downloads);

app.use(express.static('../client/public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
