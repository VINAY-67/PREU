import multer from "multer"
import cloudinary from "../utils/config.js"

export const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:2*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        if (file.mimetype.startsWith("image/")) {
            cb(null,true)            
        }
        else{
            cb(new Error("only images are allowed"),false)
        }
    },
})

export const uploadToCloudinary=(buffer,folder)=>{
    return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
}