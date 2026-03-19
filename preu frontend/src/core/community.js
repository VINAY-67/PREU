import {API} from "../backend"
import axios from "axios"
import { isAuthenticated } from "./auth"

export const getCommunities=async (id)=>{
    const {token}=isAuthenticated()
    const res=await axios.get(`${API}/communities/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return res.data
}

export const joinCommunity=async (obj)=>{
    const {token}=isAuthenticated()
    const res=await axios.post(`${API}/joincom/${obj.id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return res.statusText
}