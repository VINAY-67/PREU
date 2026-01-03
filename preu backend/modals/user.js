import mongoose from "mongoose";
import {v4} from "uuid"
import {createHmac} from "node:crypto"
const user=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,trim:true,unique:true},
    role:{type:String,default:"user"},
    encry_password:{type:String},
    salt:{type:String,trim:true},
    otpexpiry:{type:Number},
    otp:{type:Number},
    isverfied:{type:Boolean,default:false}
},{timestamps:true})

user.virtual("password")
.set(function (password){
    this._password=password
    this.salt=v4()
    this.encry_password=this.securepass(password)
})
.get(function(){
    return this._password
})


//this is used as a secondary name from the email given 
user.virtual("tagname")
.get(function(){
    return this.email.replace(/@[^\s@]+\.[^\s@]+$/,"")
})

//need to write the securepass and forget password functinalities

user.method({
    authenticate:function(password){
        return this.securepass(password)===this.encry_password
    },
    securepass:function (plainpass){
        if(!plainpass) return "" 
        try {
            return createHmac("sha256",this.salt)
        .update(plainpass)
        .digest("hex")
        } catch (error) {
            return ""
        }
        
    },
})

export default mongoose.model("User",user);