import express from 'express' ;
import { loginUser, registerUser, sendOtp, registerUserWithOtp } from "../controllers/userControllers.js";

const userRouter = express.Router() ;

userRouter.post('/register', registerUser) ;
userRouter.post('/login', loginUser) ;
userRouter.post('/send-otp', sendOtp) ;
userRouter.post('/register-with-otp', registerUserWithOtp) ;

export default userRouter ;