import mongoose, { mongo } from "mongoose";
import User from "../modals/user.js"
const profile=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:User},    
    recent:{type:Array,default:[]},
    communities_joined :{type:Array,default:[]},
    communities_created :{type:Array,default:[]},
    prompt_saved:{type:Array,default:[]},
    prompt_posted:{type:Array,default:[]},
    rating:{
        total_rating:{type:Number,default:0},
        no_of_prople_rated:{type:Number,default:0},
        overall_rating:{type:Number,default:0},
        rated:{type:Number,default:0}   
    }
})

export default mongoose.model("Profile",profile);