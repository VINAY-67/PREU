import { API } from "../backend"

export const sendMail = async (obj) => {
    const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    return res.json()
}
export const verifyOTP = async (obj) => {
    const res = await fetch(`${API}/otpVerify`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    return res.json()
}

export const login = async (obj) => {
    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    return res.json()
}

export const resendCode=async(obj)=>{
    const res=await fetch(`${API}/resendcode`,{
        method:"PUT",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify(obj)
    })
    return res.json()
}

export const forgetPass=async (obj)=>{
    const res=await fetch(`${API}/forgetPassword`,{
        method:"PUT",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json" 
        },
        body:JSON.stringify(obj)
    })
    return res.json();
}

export const authenticate = (obj, next) => {
    if (typeof window !== undefined) {
        localStorage.setItem("jwt", JSON.stringify(obj))
        next()
    }
}

export const isAuthenticated = () => {
    if (typeof window == undefined) {
        return false
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"))
    }
    else {
        return false;
    }
}

export const signout = next => {
    if (localStorage.getItem("jwt")) {
        localStorage.removeItem("jwt")
        next()
    }
}