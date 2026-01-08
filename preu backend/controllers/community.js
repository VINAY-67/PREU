import express from "express"
import Community from "../modals/community.js"
import User from "../modals/user.js"
import Profile from "../modals/profile.js"
import {uploadToCloudinary} from "../utils/multer.js"

export const getCommunityByid=async (req,res,next,id)=>{
    await Community.findById(id)
    .then(communnity=>{
        req.community=communnity;
        next();
    })
    .catch(err=>{
        return res.status(400).json({
            error:"error on finding the community"
        })
    })
}
export const getCommunities=async (req,res)=>{
    return res.json(await Community.find().select("_id name proposal"))
}

export const registerCommunity=async (req,res)=>{
    const community=await Community.create(req.body)
    if (!community) {
        return res.status(400).json({
            error:"community creation failed"
        })
    }   
    res.json(community)
}
export const joinCommunity=async (req,res)=>{
    const user=await Profile.findOneAndUpdate({user:req.profile.user._id.toString()},{
        $push:{communities_joined:req.body.name}
    },{new:true})
    if (!user) {
        return res.status(400).json({
            error:"updation failed"
        })
    }
    res.json(user.communities_joined)
}

//this needed to be seen
export const unjoinCommunity=async (req,res)=>{
    const user=await Profile.findOneAndUpdate({user:req.profile.user._id.toString()},{
        $pull:{communities_joined:req.body.name}
    },{new:true})
    if (!user) {
        return res.status(400).json({
            error:"updation failed"
        })
    }
    res.json(user.communities_joined)
}

//so far req.profile==user req.community==community
export const getPrompts=async (req,res)=>{
    res.json(req.community.prompts)
}

export const postPrompts=async (req,res)=>{
    if (!req.file) {
        return res.status(400).json({
            error:"no files were chosen"
        })
    }
    const url=await uploadToCloudinary(req.file.buffer,promtpimages);
    console.log(url);
    req.body.image=url.secure_url
    const obj={
        ...req.body,
        publicId:url.public_id
    }
    await Community.findByIdAndUpdate(req.community._id,{
        $push:{prompt:obj}
    },{new:true})
    .then(community=>{
        res.json(community)
    })
    .catch(err=>{
        return res.status(400).json({
            error:"error on saving the files "
        })
    })
}