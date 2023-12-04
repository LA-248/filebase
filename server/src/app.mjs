import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import path from 'path';
import configurePassport from './config/passport-setup.mjs';
import { db } from '../src/services/database.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import uploads from './routes/upload.mjs';
import getFiles from './routes/get-files.mjs';
import deleteFile from './routes/delete-file-handler.mjs';
import downloads from './routes/downloads.mjs';
import previews from './routes/previews.mjs';
import login from './routes/login.mjs';
import logout from './routes/logout.mjs';

const app = express();
const port = 3000;

dotenv.config();

app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

configurePassport(db);
app.use(passport.initialize());
app.use(passport.session());

// Attach routes
app.use('/', uploads);
app.use('/', getFiles);
app.use('/', deleteFile);
app.use('/', downloads);
app.use('/', previews);
app.use('/', login);
app.use('/', logout);

app.use(express.static('../../client/public'));

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
