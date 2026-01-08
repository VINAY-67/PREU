import {API} from "../backend"
import { isAuthenticated } from "./auth"

export const getProfileDetails=async (id)=>{
    const {token}=isAuthenticated()
    const res=await fetch(`${API}/profile/${id}`,{
        method:"GET",
        headers:{
            Authorization : `Bearer ${token}`
        },
    })
    return res.json()
}


export const updateProfile=async (obj)=>{
    const {user,token}=isAuthenticated()
    const res=await fetch(`${API}/updateprofile/${user._id}`,{
        method:"PUT",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(obj)
    })
    return res.json()
}