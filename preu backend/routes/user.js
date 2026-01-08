import express from "express"
const router=express.Router()

import {getUserById,getProfileDetails,updateUsername} from "../controllers/user.js"
import { isAuthenticated, isSignedIn } from "../controllers/auth.js"


router.param("userId",getUserById)
router.get("/profile/:userId",isSignedIn,isAuthenticated,getProfileDetails)
router.put("/updateprofile/:userId",isSignedIn,isAuthenticated,updateUsername)
export default router