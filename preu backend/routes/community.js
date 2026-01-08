import express from "express"
import { isAuthenticated, isSignedIn } from "../controllers/auth.js"
import {getCommunities,
    registerCommunity,
    joinCommunity, 
    unjoinCommunity,
    getCommunityByid,
    postPrompts,
    getPrompts} from "../controllers/community.js"
import {getUserById} from "../controllers/user.js"
import {upload} from "../utils/multer.js"
const router=express.Router()

router.param("userId",getUserById)
router.param("cId",getCommunityByid)
//read
router.get("/communities/:userId",isSignedIn,isAuthenticated,getCommunities)
router.get("/prompts/:userId/:cId",isSignedIn,isAuthenticated,getPrompts)

//send
router.post("/regicom/:userId",isSignedIn,isAuthenticated,registerCommunity)
router.post("/joincom/:userId",isSignedIn,isAuthenticated,joinCommunity)
router.post("/unjoincom/:userId",isSignedIn,isAuthenticated,unjoinCommunity)
router.post("/postprompt/:userId/:cId",isSignedIn,isAuthenticated,upload.single("image"),postPrompts)

export default router

