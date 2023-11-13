import dotenv from 'dotenv';
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;

import express from 'express';
import uploads from './routes/uploads.mjs';
import getFiles from './routes/get-files.mjs';
import deleteFile from './routes/delete-file-handler.mjs';
import downloads from './routes/downloads.mjs';
import previews from './routes/previews.mjs';

const app = express();
const port = 3000;
dotenv.config();

app.set('view engine', 'ejs');

// Attach routes
app.use('/', uploads);
app.use('/', getFiles);
app.use('/', deleteFile);
app.use('/', downloads);
app.use('/', previews);

app.use(express.static('../client/public'));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '6b64707b27118a74d814f6ef21b3a5b87f8d27e6befd8879d10800270d11b7d6',
  baseURL: 'http://localhost:3000',
  clientID: '5Yott16513IIFWDndeOyeFzRd0px6KWV',
  issuerBaseURL: 'https://dev-zoq2ct5ku60c4fpk.eu.auth0.com'
};

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
