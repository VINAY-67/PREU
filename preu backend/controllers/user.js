import express from "express"
import User from "../modals/user"

export const getUserById=async (req,res,next,id)=>{
    await User.findById(id)
    .then(user=>{
        req.profile=user;
        next()
    })
    .catch(err=>{return res.status(400).json({
        error:"no user was found by this id"
    })})
}

export const fogetpassword=(req,res)=>{
    const {newpass , code ,email}=req.body
    //verify the send code 

    //verify the newpass of lenght min 6

    //verify that this works
    User.findByIdAndUpdate({_id:req.profile._id},{
        $set:{password:newpass} 
    })
    .then(user=>{
        return res.status(200).json({
            msg:"updated succesfully"
        })
    })
    .catch(err=>{
        return res.status(400).json({
            error:"there is an error occured in saving the user"
        })
    })
}