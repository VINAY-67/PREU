import express from "express"
import {Request,communityCreationRequest,communityPostRequest} from "../modals/request.js"
import User from "../modals/user.js"

export const getAdminById=async (req,res,next,id)=>{
    await User.findById(id)
    .then(user=>{
        if(user.role==="emo"){
            req.profile=user;
            next();
        }
        else{
            return res.status(400).json({
                error:"you are not an admin"
            })
        }
    })
    .catch(err=>{
        return res.status(400).json({
            error:`an error occured on finding the admin${err}`
        })
    })
}

export const getRequests=async (req,res)=>{

}

export const sendRequest=async (req,res)=>{
    
}
export const acceptRequest=async (req,res)=>{
    
}
export const rejectRequest=async (req,res)=>{
    
}

