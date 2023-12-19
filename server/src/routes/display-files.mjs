import express from 'express';
import { displayStoredFiles } from '../controllers/display-files-controller.mjs';

const router = express.Router();

router.get('/home', displayStoredFiles);

export default router;
