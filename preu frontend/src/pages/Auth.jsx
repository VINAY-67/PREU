import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authenticate, login, sendMail, verifyOTP ,resendCode} from "../core/auth"
// --- NEUMORPHISM COLOR PALETTE & CONSTANTS (Pale Sky Blue Theme) ---
const NEUMO_BG = "bg-blue-50"; // Pale Sky Blue Background (The Canvas)
const NEUMO_CARD_BG = "bg-blue-100"; // Slightly darker for the card for depth
const PRIMARY_ACCENT_TEXT = "text-blue-700"; // Deep Blue Text
const PRIMARY_ACCENT_BG = "bg-blue-500"; // Solid Blue Button BG
// Neumorphic Shadows (Convex/Raised)
const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
// Neumorphic Shadows (Concave/Pressed)
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(174,174,192,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";

// --- 1. Button Component (Refined) ---
const Button = ({ children, className = "", variant = "default", size = "md", ...props }) => {
    const baseStyles = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center";
    const variants = {
        default: `${PRIMARY_ACCENT_BG} text-white shadow-lg shadow-blue-500/50 hover:bg-blue-600 active:bg-blue-700`,
        neumo: `${NEUMO_CARD_BG} text-gray-800 ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW}`,
        link: `${PRIMARY_ACCENT_TEXT} hover:text-blue-500 bg-transparent text-sm font-medium`,
    };
    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-5 py-2",
        lg: "px-6 py-3 text-lg",
    };
    return (
        <motion.button // Added motion for better interaction feedback
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// --- 2. Input Component (Improved UI/UX with Icons) ---
const Input = ({ icon: Icon, className = "", ...props }) => (
    <div className="relative w-full">
        <div className={`absolute left-0 top-0 bottom-0 flex items-center pl-3 ${PRIMARY_ACCENT_TEXT}`}>
            {Icon && <Icon className="w-5 h-5 opacity-70" />}
        </div>
        <input
            className={`w-full px-4 py-3 border border-blue-200 ${NEUMO_BG} rounded-xl text-gray-800 
                        ${PRESSED_SHADOW} focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                        placeholder:text-gray-400 transition-all duration-200 
                        ${Icon ? 'pl-10' : ''} ${className}`} // Add left padding if icon is present
            {...props}
        />
    </div>
);

// --- 3. Tabs Components (RESTORED, with Framer Motion Integration) ---

// Define directionality for the slide animation
const tabVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 150 : -150,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? 150 : -150,
        opacity: 0,
        scale: 0.95,
        position: 'absolute', // Crucial for clean exit
    }),
};


const Tabs = ({ children, defaultValue, className = "" }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    const [prevTab, setPrevTab] = useState(defaultValue);

    // Determine the direction of the animation (for slide effect)
    const direction = useMemo(() => {
        if (activeTab === 'signin' && prevTab === 'signup') return -1; // Going left (Sign In to Sign Up)
        if (activeTab === 'signup' && prevTab === 'signin') return 1;  // Going right (Sign Up to Sign In)
        return 0;
    }, [activeTab, prevTab]);

    const handleTabChange = (newTab) => {
        if (newTab !== activeTab) {
            setPrevTab(activeTab);
            setActiveTab(newTab);
        }
    };

    // Find the height of the current content to prevent layout jump
    const currentContent = React.Children.toArray(children).find(child =>
        React.isValidElement(child) && child.type.name === "TabsContent" && child.props.value === activeTab
    );
    // Use a fixed height or a max-height to smooth the form change
    const contentHeight = activeTab === 'signin' ? '240px' : '360px'; // Adjusted based on form fields

    return (
        <div className={className}>
            {/* 1. Tabs List - Passes new handler */}
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type.name === "TabsList") {
                    return React.cloneElement(child, {
                        activeTab: activeTab,
                        setActiveTab: handleTabChange, // Use new handler
                    });
                }
                return null;
            })}

            {/* 2. Content Wrapper - Handles Animation and Height */}
            <div className="relative overflow-hidden pt-4" style={{ minHeight: contentHeight }}>
                <AnimatePresence mode="wait" custom={direction}>
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child) && child.type.name === "TabsContent" && child.props.value === activeTab) {
                            return (
                                <motion.div
                                    key={activeTab} // Crucial for AnimatePresence
                                    custom={direction}
                                    variants={tabVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                    className="w-full" // Ensures it takes full width
                                >
                                    {child.props.children}
                                </motion.div>
                            );
                        }
                        return null;
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TabsList = ({ children, className = "", activeTab, setActiveTab }) => {
    // Determine indicator position for spring animation
    const indicator = {
        signin: { x: '0%' },
        signup: { x: '100%' },
    };

    return (
        <div className={`relative flex w-full p-1 border-2 border-blue-200 rounded-xl mb-8 ${NEUMO_BG} ${PRESSED_SHADOW} ${className}`}>
            {/* Animated Indicator */}
            <motion.div
                className={`absolute top-1 bottom-1 w-1/2 ${NEUMO_CARD_BG} rounded-lg ${PRIMARY_SHADOW} z-0`}
                initial={false}
                animate={indicator[activeTab]}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />

            {/* Triggers */}
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                // Clone with the new setActiveTab handler
                return React.cloneElement(child, { activeTab, setActiveTab });
            })}
        </div>
    );
};

const TabsTrigger = ({ value, activeTab, setActiveTab, children, className = "", ...props }) => {
    const isActive = value === activeTab;

    return (
        <button
            className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-300 text-base font-semibold z-10 
            ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'} ${className}`}
            onClick={() => setActiveTab(value)}
            {...props}
        >
            {children}
        </button>
    );
};

const TabsContent = ({ value, children }) => children;


// --- Main Auth Component ---

const Auth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("mrhandsomboy998@gmail.com");
    const [password, setPassword] = useState("1234567890");
    const [cpassword, setcPassword] = useState("1234567890");
    const [username, setUsername] = useState("qwerty");
    const [otp, setOtp] = useState(""); // New OTP state
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [type, setType] = useState("password");
    const [ctype, setcType] = useState("password");
    const [defaultTab, setDefaultTab] = useState("signin");
    const handleAuth = async (e, type) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let same = (password === cpassword)
        if (type === "signup" && !same && !isOtpSent) {
            setTimeout(() => {
                setLoading(false);
                setError("password didn't match !")
            }, 1500)
            return;
        }
        if (type === 'signup' && !isOtpSent) {
            const obj = {
                email: email,
                password: password,
                username: username
            }
            const data = await sendMail(obj)
            console.log("data coming was :", data);
            if (data) {
                setIsOtpSent(true)
            }
            setLoading(false);
            return;
        }

        if (type === 'signup' && isOtpSent) {
            const obj = {
                email: email,
                otp: otp
            }
            const data = await verifyOTP(obj)
            if (data) {
                setDefaultTab("signin")
                setPassword("");
                setcPassword("");
                setUsername("");
                setOtp("");
                setIsOtpSent(false);
                setLoading(false);
            }
            return;
        }

        if (type === 'signin') {
            const obj = {
                username: username,
                password: password
            }
            const data = await login(obj)
            if (data) {
                authenticate(data, () => {
                    setEmail("");
                    setPassword("");
                    setUsername("");
                })
                navigate(`/profile/${data.user._id}`);
            }
        } else {
            setDefaultTab("signin")
        }
    };
    const resendCode=async ()=>{
        const data=await resendCode({email:email})
        if (data) {
            console.log("code sent successfully");
        }
    }
    const getPasswordStrength = (password) => {
        let score = 0;
        const length = password.length;

        if (length < 6) {
            return {
                width: '0%',
                color: 'bg-gray-400',
                label: 'Too Short',
                message: 'Need at least 6 characters to start!',
                emoji: '🤔'
            };
        }

        // Scoring logic (same as before)
        if (length >= 8) score += 1;
        if (length >= 12) score += 1;
        if (/[A-Z]/.test(password)) score += 1; // Uppercase
        if (/[a-z]/.test(password)) score += 1; // Lowercase
        if (/\d/.test(password)) score += 1;    // Numbers
        if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special characters

        if (score < 3) {
            return {
                width: '33%',
                color: 'bg-red-500',
                label: 'think about it',
                message: 'Ouch! That\'s a bit easy to guess. Try adding numbers or symbols.',
                emoji: '🤚'
            };
        } else if (score < 5) {
            return {
                width: '66%',
                color: 'bg-yellow-500',
                label: 'not Bad',
                message: 'Getting there! Mix in some capital letters and be creative!',
                emoji: '😉'
            };
        } else {
            return {
                width: '100%',
                color: 'bg-green-500',
                label: 'considerable',
                message: 'Done and Dusted 💥',
                emoji: '😮‍💨'
            };
        }
    };

    const PasswordStrengthBar = (password) => {
        const strength = getPasswordStrength(password);

        // Only show the feedback when the user has started typing
        if (password.length === 0) {
            return null;
        }

        // Custom background and text colors based on strength color
        const baseColorClass = strength.color.replace('bg-', '');
        const bgColor = `bg-${baseColorClass}-100`; // e.g., bg-red-100
        const textColor = `text-${baseColorClass}-700`; // e.g., text-red-700
        const borderColor = `border-gray-400`; // e.g., border-red-300

        return (
            <div className="mt-2 space-y-2">

                {/* 1. Animated Strength Bar */}
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full ${strength.color} `}
                        initial={{ width: '0%' }}
                        animate={{ width: strength.width }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>

                {/* 2. Dialogue Box Feedback */}
                <motion.div
                    key={strength.label} // Key changes on strength update to trigger animation
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 text-sm rounded-lg  ${bgColor} ${textColor} ${PRESSED_SHADOW} ${PRIMARY_SHADOW}`}
                >
                    <div className="flex items-start">
                        <span className="text-xl mr-2 mt-0.5">{strength.emoji}</span>
                        <div>
                            <span className="font-bold mr-1">
                                {strength.label}:
                            </span>
                            {strength.message}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${NEUMO_BG} text-gray-900 p-4`}>
            {/* Increased max-width for better look on large displays, maintained padding for small displays */}
            <div className="w-full max-w-sm sm:max-w-md">

                {/* Header Section (Logo/Title) */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 mb-3">
                        {/* <Sparkles className={`h-8 w-8 sm:h-10 sm:w-10 opacity-80 ${PRIMARY_ACCENT_TEXT}`} />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">PREU</h1> */}
                        <img src="./Preu.png" alt="" className="h-20" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">Discover and rate the best AI prompts.</p>
                </motion.div>

                {/* Auth Card: Neumorphic Element (Responsive Padding) */}
                <motion.div
                    className={`${NEUMO_CARD_BG} rounded-3xl border-2 border-blue-200 ${PRIMARY_SHADOW} p-6 sm:p-8 relative`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >

                    <Tabs defaultValue={defaultTab}>
                        <TabsList>
                            <TabsTrigger value="signin" className="cursor-pointer">Sign In</TabsTrigger>
                            <TabsTrigger value="signup" className="cursor-pointer">Sign Up</TabsTrigger>
                        </TabsList>

                        {/* Error Message Box */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-6 p-4 bg-red-100 border border-red-400 rounded-xl text-red-700 text-sm font-medium"
                                >
                                    <span className="font-bold">Error:</span> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Sign In Content */}
                        <TabsContent value="signin">
                            <form onSubmit={(e) => handleAuth(e, 'signin')} className="space-y-6 pb-10 relative">
                                <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                                <div className="flex justify-between items-center text-sm">
                                    <label className="flex items-center text-gray-600">
                                        <input type="checkbox" className="mr-2 rounded border-blue-300 cursor-pointer text-blue-600 focus:ring-blue-500" />
                                        Remember me
                                    </label>
                                    <Button type="button" variant="link" className="cursor-pointer " onClick={() => navigate("/forgot")}>Forgot Password?</Button>
                                </div>

                                <Button type="submit" className="w-full h-11 text-base cursor-pointer" disabled={loading}>
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Sign Up Content */}
                        <TabsContent value="signup">
                            <form onSubmit={(e) => handleAuth(e, 'signup')} className="space-y-6 pb-10">

                                {/* Step 1: User Details (Only show if OTP hasn't been sent) */}
                                <AnimatePresence mode="wait">
                                    {isOtpSent ? (
                                        // Step 2: OTP Input (Visible after OTP is sent)
                                        <motion.div
                                            key="otp-input"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <p className="text-center text-sm text-gray-600 font-medium">
                                                A verification code has been sent to <span className={`${PRIMARY_ACCENT_TEXT} font-semibold`}>{email}</span>.
                                            </p>
                                            <Input
                                                type="text"
                                                placeholder="Enter 6-digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                                required
                                                inputMode="numeric"
                                            />
                                            <button 
                                            type="button"
                                            onClick={()=>(resendCode)}
                                            className="text-center text-sm text-gray-600 font-medium ml-48 "
                                            >Resend Code ?</button>
                                        </motion.div>
                                    ) : (
                                        // Step 1: Initial Signup Fields
                                        <motion.div
                                            key="initial-signup"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6 "
                                        >
                                            <Input icon={User} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                            <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />

                                            <div className="relative">
                                                <Input icon={Lock} type={type} placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                                                <EyeOff className={`absolute  right-0 top-0 mt-[14px] mr-4 ${type == "password" ? "hidden" : "visible"} text-blue-500`} onClick={() => setType("password")} />
                                                <Eye className={`absolute  right-0 top-0 mt-[14px] mr-4 ${type == "password" ? "visible" : "hidden"} text-blue-500`} onClick={() => setType("text")} />
                                            </div>
                                            {PasswordStrengthBar(password)}
                                            <div className="relative">
                                                <Input icon={Lock} type={ctype} placeholder="Confirm password" value={cpassword} onChange={(e) => setcPassword(e.target.value)} required minLength={6} />
                                                <EyeOff className={`absolute  right-0 top-0 mt-[14px] mr-4 ${ctype == "password" ? "hidden" : "visible"} text-blue-500`}
                                                    onClick={() => { setcType("password") }} />
                                                <Eye className={`absolute  right-0 top-0 mt-[14px] mr-4 ${ctype == "password" ? "visible" : "hidden"} text-blue-500`} onClick={() => setcType("text")} />
                                            </div>
                                            {error && (
                                                <div className="mb-6 p-4  bg-red-100 border border-red-400 rounded-xl text-red-700 text-sm font-medium">
                                                    <span className="font-bold">Error:</span> {error}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base cursor-pointer mt-8"
                                    disabled={loading || (!isOtpSent && (!username || !email || !password || password.length < 6)) || (isOtpSent && otp.length !== 4)}
                                >
                                    {loading
                                        ? <Loader2 className="h-5 w-5 animate-spin" />
                                        : isOtpSent ? "Register (Verify OTP)" : "Send OTP & Sign Up"
                                    }
                                </Button>

                            </form>
                        </TabsContent>
                    </Tabs>
                    <button className="items-center ml-25 md:ml-35 text-base hover:scale-98 cursor-pointer " onClick={() => navigate("/")}>back to home </button>
                </motion.div>

                <motion.p
                    className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    By continuing, you agree to our <a href="#" className={`${PRIMARY_ACCENT_TEXT} hover:text-blue-500 font-medium`}>Terms of Service</a> and <a href="#" className={`${PRIMARY_ACCENT_TEXT} hover:text-blue-500 font-medium`}>Privacy Policy</a>
                </motion.p>
            </div>

        </div>
    );
};

export default Auth;