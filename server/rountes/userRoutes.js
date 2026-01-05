import express from 'express'
import { getCars, getUserData, registerUser, userLogin } from '../controller/userControllers.js';
import { protect } from '../middleware/auth.js';

const userRouter  = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', userLogin)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)

export default userRouter