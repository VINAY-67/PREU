import express from "express"
const router=express.Router()

import {getUserById,fogetpassword} from "../controllers/user"


router.param("userId",getUserById)

//TODO : forget password again once 
router.put("/forgetpass/:userId",fogetpassword)
export default router