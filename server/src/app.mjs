import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import configurePassport from './config/passport-setup.mjs';
import { db } from '../src/services/database.mjs';

import uploads from './routes/upload.mjs';
import getFiles from './routes/get-files.mjs';
import deleteFile from './routes/delete-file-handler.mjs';
import downloads from './routes/downloads.mjs';
import previews from './routes/previews.mjs';
import auth from './routes/auth.mjs';

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
app.use('/', auth);

app.use(express.static('../../client/public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
