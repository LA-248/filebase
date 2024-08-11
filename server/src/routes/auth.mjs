import express from 'express';
import passport from 'passport';

const authRouter = express.Router();

// Login
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home
    res.redirect('/home');
    console.log('Logged in');
  }
);

// Logout
authRouter.get('/logout', (req, res) => {
  req.logout(function (err) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
      console.log('Session destroyed');
    });
  });
});

export default authRouter;
