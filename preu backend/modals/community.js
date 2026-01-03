import mongoose from "mongoose"
import {ObjectId} from mongoose.Schema
const community=new mongoose.Schema([
    {
        name:{type:String,required:true},
        description:{type:String,required:true,trim:true},
        member_count:{type:Number,default:0},
        ranking:{type:Number,default:0},
        prompts:[{
            title:{type:String,required:true},
            prompt:{type:String,michar:20},
            author:{
                type:ObjectId,
                ref:User
            },
            rating:{type:Number,default:0},
            bookmarks:{type:Number,default:0},
            tags:{type:Array,default:[]},
            image:{type:String,default:""}
        }]
    }
])

export default mongoose.model("Community",community);