import express from 'express';
import { authMiddleware } from '../middlewares/auth.mjs';
import { deleteAccount } from '../controllers/delete-account-controller.mjs';

const userAccountRouter = express.Router();

userAccountRouter.delete('/', authMiddleware, deleteAccount);

export default userAccountRouter;
