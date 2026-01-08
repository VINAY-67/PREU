import mongoose from "mongoose"

const options={
    discriminatorKey:"type",
    timestamps:true
}

const requestSchema=new mongoose.Schema(
    {
        type:{ type:String,enum:['COMMUNITY_CREATION','COMMUNITY_POST'],required:true},
        metadata:{
            userId:{type:String,required:true},
            communityId:{type:String}
        },  //this can be either userId or a communityId&userId 
        status: {type:String,enum:['PENDING','REJECTED','ACCEPTED'],default:'PENDING'},
    },options
)
    
    
const Request= mongoose.model("Request",requestSchema)

const communityCreationSchema=new mongoose.Schema({
    data: {
        communityName: {type:String,required:true},
        contentType: {type:String,enum:["data","code","image","text"],required:true},
        motive: {type:String,enum:["educational","commercial"],required:true},
        proposal:{type:String,required:true},
    },
})

const communityCreationRequest=Request.discriminator(
    "COMMUNITY_CREATION",
    communityCreationSchema
)
const communityPostSchema=new mongoose.Schema({
    data: {
        title:{type:String,required:true},
        prompt:{type:String,minlength:20},
        rating:{type:Number,default:0},
        bookmarks:{type:Number,default:0},
        tags:{type:[String],default:[]},
        image:{type:String,default:""}
    },
})

const communityPostRequest=Request.discriminator(
    "COMMUNITY_POST",
    communityPostSchema
)

export {Request,communityCreationRequest,communityPostRequest}
