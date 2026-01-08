import mongoose from "mongoose"
import User from "../modals/user.js"
const community=new mongoose.Schema([
    {
        name:{type:String,required:true,unique:true},
        type:{type:String,required:true},
        motive:{type:String,required:true},
        proposal:{type:String,required:true,trim:true},
        member_count:{type:Number,default:0},
        ranking:{type:Number,default:0},  // for now keep it as aside then work on it 
        prompts:[{
            title:{type:String,required:true,unique:true},
            prompt:{type:String,michar:20},
            author:{type:String,required:true},
            rating:{type:Number,default:0},
            bookmarks:{type:Number,default:0},
            tags:{type:Array,default:[]},
            image:{type:String,default:""}
        }],
        agreed:{type:Boolean,default:false}
    }
])

export default mongoose.model("Community",community);