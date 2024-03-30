import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

router.get('/settings', authMiddleware, (req, res) => {
  res.render('settings.ejs', {
    displayName: req.user.displayName,
  });
});

export default router;
