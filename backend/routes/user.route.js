import express from 'express';
import authMiddleware from '../authMiddleware.js';
import { getUserData } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/me", authMiddleware, getUserData);


export default router;