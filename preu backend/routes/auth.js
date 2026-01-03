import express, { Router } from "express"
import {register,
    login,
    verifyOTP, 
    forgotPassword,
    resenCode} from "../controllers/auth.js"
import {check} from "express-validator" 

const router=express.Router()


router.post("/register",[
    check("username","username must be unique"),
    check("email","input must be an email").isEmail()],register)

router.post("/otpVerify",verifyOTP)    
router.post("/login",login)
router.put("/resendcode",resenCode)
router.put("/forgetPassword",forgotPassword)
// router.get("/api/verify/:token")
export default router