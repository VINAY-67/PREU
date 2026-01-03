import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, Key, Send, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import {resendCode,forgetPass, verifyOTP} from "../core/auth"
import 'react-toastify/dist/ReactToastify.css';

// --- NEUMORPHISM CONSTANTS ---
const NEUMO_BG = "bg-blue-50";
const NEUMO_CARD_BG = "bg-blue-100";
const PRIMARY_ACCENT_TEXT = "text-blue-700";
const PRIMARY_ACCENT_BG = "bg-blue-500";
const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
const PRESSED_SHADOW = "shadow-[inset:3px_3px_5px_rgba(174,174,192,0.4),inset:-3px_-3px_5px_rgba(255,255,255,1)]";

// --- Components (Button & Input) ---
const Button = ({ children, className = "", variant = "default", size = "md", ...props }) => {
    const baseStyles = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center";
    const variants = {
        default: `${PRIMARY_ACCENT_BG} text-white shadow-lg shadow-blue-500/50 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50`,
        neumo: `${NEUMO_CARD_BG} text-gray-800 ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW}`,
        link: `${PRIMARY_ACCENT_TEXT} hover:text-blue-500 bg-transparent text-sm font-medium`,
    };
    const sizes = { sm: "px-3 py-1 text-sm", md: "px-5 py-2", lg: "px-6 py-3 text-lg" };
    return (
        <motion.button
            whileTap={{ scale: props.disabled ? 1 : 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

const Input = ({ icon: Icon, className = "", isPassword, ...props }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative w-full">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${PRIMARY_ACCENT_TEXT}`}>
                {Icon && <Icon className="w-5 h-5 opacity-70" />}
            </div>
            <input
                type={isPassword && !show ? "password" : "text"}
                className={`w-full px-4 py-3 border border-blue-200 ${NEUMO_BG} rounded-xl text-gray-800 
                            ${PRESSED_SHADOW} focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                            placeholder:text-gray-400 transition-all duration-200 
                            ${Icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''} ${className}`}
                {...props}
            />
            {isPassword && (
                <button 
                    type="button" 
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
};

// --- Main Component ---
const ForgetPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('email'); // 'email' | 'verify' | 'reset'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "misteranonymous590@gmail.com",
        code: "",
        password: "",
        confirmPassword: ""
    });

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data=await resendCode({email:formData.email})
        if (data) {
            setLoading(false)
            setStep('verify');
            toast.success("Code sent to your email!");
        }
    };

    const handleCodeVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data=await verifyOTP({email:formData.email,otp:formData.code})
        if (data) {
            setLoading(false);
            setStep('reset');
            toast.success("Identity verified!");
        }
    };

    const handlePasswordReset = async(e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        setLoading(true);
        const data=await forgetPass({email:formData.email,password:formData.password,otp:formData.code})
        if (data) {
            setLoading(false);
            toast.success("Password updated successfully!");
            navigate('/auth');
        }
    };

    const renderHeader = () => {
        if (step === 'email') return { title: "Forgot Password", desc: "Enter email to receive code." };
        if (step === 'verify') return { title: "Verify Code", desc: `Enter the 6-digit code sent to ${formData.email}` };
        return { title: "New Password", desc: "Set a strong password to secure your account." };
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${NEUMO_BG} p-4`}>
            <ToastContainer position="top-right" theme="colored" />
            <div className="w-full max-w-md">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">{renderHeader().title}</h1>
                    <p className="text-gray-600 mt-2">{renderHeader().desc}</p>
                </header>

                <motion.div layout className={`${NEUMO_CARD_BG} rounded-3xl border-2 border-blue-200 ${PRIMARY_SHADOW} p-8`}>
                    <AnimatePresence mode="wait">
                        {step === 'email' && (
                            <motion.form key="e" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleEmailSubmit} className="space-y-6">
                                <Input icon={Mail} placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                                <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Send Code"}</Button>
                            </motion.form>
                        )}

                        {step === 'verify' && (
                            <motion.form key="v" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleCodeVerification} className="space-y-6">
                                <Input icon={Key} placeholder="4-Digit Code" maxLength={6} value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} required />
                                <Button type="submit" className="w-full" disabled={loading || formData.code.length < 3}>Verify Identity</Button>
                                <button type="button" onClick={() => setStep('email')} className="w-full text-xs text-blue-600 hover:underline">Change Email</button>
                            </motion.form>
                        )}

                        {step === 'reset' && (
                            <motion.form key="r" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handlePasswordReset} className="space-y-6">
                                <Input icon={Lock} isPassword placeholder="New Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                                <Input icon={CheckCircle} isPassword placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                                <Button type="submit" className="w-full" disabled={loading}>Update Password</Button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="text-center mt-6">
                    <Button variant="link" onClick={() => navigate("/auth")}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;