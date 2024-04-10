import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Render the settings page
router.get('/settings', authMiddleware, (req, res) => {
  res.render('settings.ejs', {
    displayName: req.user.displayName,
    email: req.user.email,
  });
});

export default router;
