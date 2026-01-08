import express from "express"
import User from "../modals/user.js"
import Profile from "../modals/profile.js"

export const getUserById=async (req,res,next,id)=>{
    await Profile.findOne({user:id}).populate("user","username tagname")
    .then(user=>{
        req.profile=user;
        next()
    })
    .catch(err=>{return res.status(400).json({
        error:"no user was found by this id"
    })})
}

export const getProfileDetails=(req,res)=>{
    res.json(req.profile)
}

export const updateUsername=async (req,res)=>{
    const {username}=req.body
    const user=await User.findOneAndUpdate(req.profile.user._id,{
        $set:{username:username}
    },{new:true})
    if(!user){
        return res.status(400).json({
            error:"updating user was failed"
        })
    }
    return res.json(user)

}