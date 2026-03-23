import {Router } from 'express';
import { loginUser, registerUser, refreshAccessToken } from '../controllers/user.controller.js';
import  {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/refresh-token",refreshAccessToken)
export default router;