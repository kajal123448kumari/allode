import { Router } from "express";
import { emailVerify, resendEmailVerification, userLogin, userRegisterForShopify } from "../controllers/userController";


const userRouter = Router();

// userRouter.post('/register',userRegister)
userRouter.post('/registerShopify',userRegisterForShopify)
userRouter.get('/verifyEmail/:userId/:token',emailVerify)
userRouter.post('/login',userLogin)
userRouter.post('/resendVerify',resendEmailVerification)

export default userRouter;

