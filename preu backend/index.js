import 'dotenv/config'
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser'
import cors from "cors"

//my custom routes

const app=express()

mongoose.connect(process.env.DATABASE)
.then(()=>{console.log("Db Connected ");})

//middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors)


//api


app.get("/",(req,res)=>{
    res.send("hello vinay")
})

const port =process.env.port || 5000
app.listen(port,()=>{
    console.log(`server was running on port ${port}`);
    
})