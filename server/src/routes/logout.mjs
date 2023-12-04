import express from 'express';
const router = express.Router();

// Logout route
router.get('/logout', (req, res) => {
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

export default router;
