import express from "express"
import User from "../modals/user.js"
import Profile from "../modals/profile.js" 
import {validationResult} from "express-validator"
import { expressjwt } from "express-jwt"
import {sendMail} from "../utils/mails.js"
import jwt from "jsonwebtoken"

export const hiroute=(req,res)=>{
    res.send("hi vinary from controller")
}
export const login=async (req,res)=>{
    const {username,password}=req.body
    await User.findOne({username})
    .then(user=>{
        if(!user.authenticate(password)){
            return res.status(404).json({
                error:"password didnt match"
            })
        }
        if(!user.isverfied){
            return res.status(404).json({
                error:"user is not verified "
            })
        }
        const token=jwt.sign({_id:user._id},process.env.SECRET)
        res.cookie("token",token,{maxAge:60000})
        const {_id,username,email,role}=user
        return res.json({
            token,
            user:{
                _id,username,email,role
            }
        })
    })
    .catch(err=>{
        return res.status(400).json({
            error:"no user was found with this crededntials"
        })
    })
}
export const register=async (req,res)=>{
    const{username,email,password}=req.body
    const otp = Math.floor(1000 + Math.random() * 9000)
    let errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error:errors.array()[0].msg
        })
    }
    const existuser=await User.findOne({username})
    if(existuser){
        return res.status(400).json({
            msg:"user already exists try login or use forget password !"
        })
    }
    const currentTimeStamp=parseInt((new Date().getTime()/1000))
    const user= new User(req.body)
    user.otpexpiry=currentTimeStamp+600
    user.otp=otp
    await user.tagNameGenerate(email)
    await user.save()
    const profile=await Profile.create({
        user:user._id
    })
    await sendMail(email,otp)
    return res.json({
        email:user.email,
        otp:otp
    })
}

export const resenCode=async (req,res)=>{
    const otp = Math.floor(1000 + Math.random() * 9000)
    const currentTimeStamp=parseInt((new Date().getTime()/1000))
    const existuser=await User.findOneAndUpdate(req.body,{
        $set:{otp:otp,otpexpiry:currentTimeStamp+600}
    })
    if(!existuser){
        return res.status(400).json({
            msg:"no user already exists try resgistering !"
        })
    }
    await sendMail(req.body.email,otp)
    return res.json({
        email:req.body.email,
        otp:otp
    })
}

export const forgotPassword=async (req,res)=>{
    const {email,otp,password}=req.body
    const currentTimeStamp=parseInt((new Date().getTime()/1000))
    const user=await User.findOne({email:email})
    if (!user) {
        return res.status(400).json({
            error:"no user was found bud have a look at email"
        })
    }
    if (!user.isverfied) {
        return res.status(400).json({
            error:"you haven't even registered !!"
        })
    }
    if(!(user.otp===parseInt(otp)) || user.otpexpiry<currentTimeStamp){
        return res.status(400).json({
            error:"otp doesnt matched or expired "
        })
    }
    user.password=password
    await user.save();
    return res.json({
        msg:"password saved succesfully !!"
    })
}
export const verifyOTP=async (req,res)=>{
    const {email,otp}=req.body
    const currentTimeStamp=parseInt((new Date().getTime()/1000))
    const user=await User.findOne({email})
    if(!user){
        res.status(400).json({
            error:"no user was found to us !!"
        })
    }   
    if(user.otp===otp && user.otpexpiry<currentTimeStamp){
        res.status(400).json({
            error:"otp expired !!"
        })
    }
    user.isverfied=true
    await user.save()
    res.json({
        user:user.email
    })
}
export const isSignedIn=expressjwt({
    secret:process.env.SECRET,
    UserProperty:"auth",
    algorithms:["HS256"]
})  
export const isAuthenticated=(req,res,next)=>{
    const checker=req.profile && req.auth && req.profile.user._id.toString()===req.auth._id
    if (!checker) {
        return res.status(400).json({
            error:"you are not Authenticated "
        })
    }
    next();
}
export const isAdmin=(req,res,next)=>{
    if (!req.profile.role==1) {
        return  res.status(400).json({
            error:"you are not allowe to do this operation !!"
        })
    }
    next();
}