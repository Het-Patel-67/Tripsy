import {Router } from 'express';
import { loginUser, registerUser,  logoutUser, getMe } from '../controllers/user.controller.js';
import  {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register",registerUser)
router.post("/login" ,loginUser)
router.get("/me",      verifyJWT, getMe);
router.post("/logout", verifyJWT, logoutUser);
export default router;