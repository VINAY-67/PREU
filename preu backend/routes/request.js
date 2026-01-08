import express from "express"
import {getRequests,getAdminById} from "../controllers/request.js"
import {getCommunityByid} from "../controllers/community.js"
import {getUserById} from "../controllers/user.js"

const router=express.Router()

router.param("adminId",getAdminById)
//read
router.get("/requests/:adminId",getRequests)

//send

export default router