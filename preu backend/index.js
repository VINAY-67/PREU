import 'dotenv/config'
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser'
import cors from "cors"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import communityRoutes from "./routes/community.js"
import requestRoutes from "./routes/request.js"

//my custom routes

const app=express()

mongoose.connect(process.env.DATABASE)
.then(()=>{console.log("Db Connected ");})
.catch(err=>{console.log(err);
})
//middlewares
app.use(bodyParser.json()) 
app.use(cookieParser()) 
app.use(cors()) 


app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",communityRoutes)
app.use("/api",requestRoutes)

app.get("/",(req,res)=>{
    res.send("hello vinay")
})


const port =process.env.port || 5000
app.listen(port,()=>{
    console.log(`server was running on port http://localhost:${port}`);
    
})