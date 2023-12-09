import express from 'express';
import { getStoredUserFiles } from '../controllers/get-files-controller.mjs';

const router = express.Router();

router.get('/home', getStoredUserFiles);

export default router;
