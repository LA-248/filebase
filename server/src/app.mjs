import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import configurePassport from './config/passport-setup.mjs';
import { db } from '../src/services/database.mjs';

import authRouter from './routes/auth.mjs';
import filesRouter from './routes/files.mjs';
import foldersRouter from './routes/folders.mjs';
import navigationRouter from './routes/navigation.mjs';
import userAccountRouter from './routes/user-account.mjs';

const app = express();
const port = 3000;

// Enables the app to parse JSON payloads in incoming requests
app.use(express.json());

app.set('view engine', 'ejs');

// Configure session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // Set cookie expiry (10 years)
    },
  })
);

configurePassport(db);
app.use(passport.initialize());
app.use(passport.session());

// Attach routes
app.use('/auth', authRouter);
app.use('/files', filesRouter);
app.use('/folders', foldersRouter);
app.use('/account', userAccountRouter);
app.use('/', navigationRouter);

app.use(express.static('../../client/public'));

app.get('/login', (req, res) => {
  res.render('pages/login.ejs');
});

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/home`);
});
