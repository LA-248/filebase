const express = require('express');
const app = express();
const upload = require('./routes/upload');
const port = 3000;

app.use('/', upload);

app.use(express.static('../client/public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
