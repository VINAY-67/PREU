import mongoose from "mongoose";
import {ObjectId} from mongoose.Schema

const profile=new mongoose.Schema({
    user:{type:ObjectId,ref:User},
    creator_metrics:{
        influence:{type:Number,max:999},
        psaved:{type:Number,max:999},
        ratings:{type:Number,max:999},
        communities:{type:Number,max:999}
    },
    recent:{
        type:Array,
        default:[]
    }
})

export default module.exports("Profile",profile);