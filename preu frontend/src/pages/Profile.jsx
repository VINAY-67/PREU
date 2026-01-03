import { useEffect, useState } from "react";
import { User, TrendingUp, MessageSquare,Bookmark, Users, Edit2, Loader2, Zap, CheckCircle, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // <-- Import Framer Motion

// --- NEUMORPHISM COLOR PALETTE & CONSTANTS (Pale Sky Blue Theme) ---
const NEUMO_BG = "bg-blue-50"; 
const NEUMO_CARD_BG = "bg-blue-100"; 
const PRIMARY_ACCENT_TEXT = "text-blue-700"; 
const CTA_GRADIENT = "bg-gradient-to-r from-cyan-500 to-blue-600"; 
const CTA_SHADOW = "shadow-xl shadow-cyan-500/30";

// Neumorphic Shadows (Convex/Raised)
const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
// Neumorphic Shadows (Concave/Pressed - used for active/toggled state)
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(174,174,192,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";


// --- COMPONENTS (Updated to use Motion) ---

// Button Component (Neumorphic Style with Motion)
const Button = ({ children, className = "", variant = "default", size = "md", ...props }) => {
 const baseStyles = "font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center";
 
 const variants = {
  default: `${CTA_GRADIENT} text-white ${CTA_SHADOW} hover:opacity-95 active:shadow-none`,
  neumo: `${NEUMO_CARD_BG} text-gray-700 ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW} active:shadow-none`,
  icon: `${NEUMO_CARD_BG} text-gray-500 ${PRIMARY_SHADOW} p-3 hover:scale-[1.05] active:${PRESSED_SHADOW} active:shadow-none`,
  contactIcon: `${NEUMO_CARD_BG} text-gray-500 ${PRIMARY_SHADOW} p-2 hover:scale-[1.1] active:${PRESSED_SHADOW} active:shadow-none rounded-full`,
 };
  
 const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-6 py-3",
  lg: "px-8 py-4 text-lg",
  icon: "p-3", 
 };
 
 const variantStyles = variants[variant] || variants.default;

 return (
  <motion.button // <-- motion.button
        whileTap={{ scale: props.disabled ? 1 : 0.98 }}
   className={`${baseStyles} ${variantStyles} ${sizes[size]} ${className}`} 
   {...props}
  >
   {children}
  </motion.button>
 );
};

// Card Component (Neumorphic Style with Motion)
const Card = ({ children, className = "", ...props }) => (
 <motion.div // <-- motion.div
    whileHover={{ y: -1, boxShadow: "0 8px 10px rgba(174,174,192,0.6)" }} 
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} ${className}`} 
    {...props}
  >
  {children}
 </motion.div>
);

// Input Component (Neumorphic Pressed Style)
const Input = ({ className = "", ...props }) => (
 <input 
  className={`w-full px-4 py-3 ${NEUMO_BG} ${PRESSED_SHADOW} rounded-xl text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow ${className}`} 
  {...props} 
 />
);

// Label Component
const Label = ({ children, htmlFor, className = "", ...props }) => (
 <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-600 ${className}`} {...props}>
  {children}
 </label>
);

// Metric Badge Component (Raised data block) - Friendly Terminology
const MetricBadge = ({ icon: Icon, label, value }) => (
  <Card 
    className={`p-4 md:p-5 flex flex-col items-center justify-center w-full h-full text-center shadow-md`}
  >
    <div className="flex items-center space-x-2 mb-2">
      <Icon className="w-5 h-5 text-blue-500" />
      <span className="text-2xl font-extrabold text-gray-800">{value.toLocaleString()}</span>
    </div>
    {/* FRIENDLY LABEL */}
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
  </Card>
);

// Activity Item Component (Cleaned up list item)
const ActivityItem = ({ title, time, icon: Icon, color }) => (
  <Card className="p-4 flex items-center justify-between cursor-pointer shadow-md rounded-2xl">
    <div className="flex items-center">
      <div className={`p-2 rounded-xl shadow-inner ${color} bg-blue-50 flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </Card>
);

// --- MAIN APP COMPONENT ---

const App = () => {
 const [profile, setProfile] = useState(null);
 const [editing, setEditing] = useState(false);
 const [username, setUsername] = useState("");
 const [loadingUpdate, setLoadingUpdate] = useState(false);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [successMessage, setSuccessMessage] = useState(""); 

 useEffect(() => {
  fetchProfile();
 }, []);

 // Mock function to simulate fetching data
 const fetchProfile = async () => {
  setLoading(true);
  const mockData = {
   username: "PromptMaster_99",
   role: "AI Prompt Engineer", 
   popularity_score: 4520,
   prompts_posted: 125,
   prompts_rated: 890,
   communities_joined: 4,
  };

  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    setProfile(mockData);
    setUsername(mockData.username);
  } catch (err) {
   setError("Failed to load profile");
  } finally {
   setLoading(false);
  }
 };

 // Mock function to simulate profile update
 const handleUpdateProfile = async () => {
  setLoadingUpdate(true);
  setError("");
  setSuccessMessage("");

  try {
   await new Promise(resolve => setTimeout(resolve, 1000)); 
   
   setSuccessMessage("Your profile has been successfully updated!");
   setEditing(false);
   
   setProfile(prev => ({ ...prev, username: username }));

  } catch (err) {
   setError("Uh oh! We couldn't save your changes. Please try again."); // FRIENDLY ERROR
  } finally {
   setLoadingUpdate(false);
  }
 };

 if (loading) {
  return (
   <div className={`min-h-screen flex items-center justify-center ${NEUMO_BG} font-sans`}>
    <div className={`flex items-center space-x-3 ${PRIMARY_ACCENT_TEXT} p-8 rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW}`}>
     <Loader2 className="h-6 w-6 animate-spin" />
     <span className="text-xl font-semibold">Gathering your data...</span> {/* FRIENDLY LOADING TEXT */}
    </div>
   </div>
  );
 }

 if (!profile) {
  return (
   <div className={`min-h-screen flex items-center justify-center ${NEUMO_BG} font-sans`}>
    <Card className="p-8 text-center">
     <p className="text-red-600 mb-4">We hit a snag loading your profile.</p> {/* FRIENDLY ERROR */}
     <Button onClick={fetchProfile}>Try Loading Again</Button>
    </Card>
   </div>
  );
 }

 // Stats array - FRIENDLY LABELS
 const stats = [
  {
   icon: Zap,
   label: "Influence Rank", // FRIENDLY TERM
   value: profile.popularity_score || 0,
  },
  {
   icon: Bookmark ,
   label: "Prompts You've Saved", // FRIENDLY TERM
   value: profile.prompts_posted || 0,
  },
  {
   icon: TrendingUp,
   label: "Ratings Given", // FRIENDLY TERM
   value: profile.prompts_rated || 0,
  },
  {
   icon: Users,
   label: "Communities Joined",
   value: profile.communities_joined || 0,
  }
 ];
 
 const recentActivities = [
  { title: "Rated 'Desert Sunset'", time: "2 hours ago", icon: CheckCircle, color: "text-green-500" },
  { title: "Posted 'Vibrant Cyberpunk'", time: "Yesterday", icon: MessageSquare, color: "text-cyan-500" },
  { title: "Joined 'Sci-Fi Writers' C'", time: "3 days ago", icon: Users, color: "text-indigo-500" },
  { title: "Commented on 'Abstract Art'", time: "1 week ago", icon: MessageSquare, color: "text-yellow-500" },
 ];


 return (
  <div className={`${NEUMO_BG} text-gray-800 min-h-screen font-sans`}>
   <div className="container mx-auto px-4 py-12 md:py-16">
    
    {/* Main Content Area with overall motion container */}
    <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto space-y-8"
        >
     
     {/* FRIENDLY TITLE */}
     <h1 className="text-4xl font-extrabold text-gray-800 hidden lg:block">
      Your Beautiful Profile
     </h1>

     {/* Success/Error Messages - Wrapped in AnimatePresence */}
     <AnimatePresence>
      {successMessage && (
        <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
          <Card className="p-6 w-full max-w-sm flex flex-col items-center text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">Success!</h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <Button 
              onClick={() => setSuccessMessage("")} 
              variant="neumo" 
              className="w-full"
              size="sm"
            >
              Awesome!
            </Button>
          </Card>
        </motion.div>
      )}

      {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 shadow-md"
                >
         {error}
        </motion.div>
      )}
     </AnimatePresence>

     {/* CORE LAYOUT: Responsive Grid */}
     <div className="grid lg:grid-cols-5 gap-8">
      
      {/* LEFT COLUMN: Profile and Integrated Stats (3/5 width) - Separate Motion */}
      <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-3 space-y-8"
            >
       
       {/* 1. Main Profile Card */}
       <Card className="p-8 space-y-8"> 
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-start items-center gap-6 border-b border-blue-200 pb-6">
          
          {/* Avatar */}
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full ${PRIMARY_SHADOW} bg-blue-200 flex items-center justify-center flex-shrink-0`}>
            {/* <User className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600" />
             */}
             <img src="./profile.jpg" alt="" className="rounded-[50%]"/>
          </div>

          {/* Details and Edit */}
          <div className="flex flex-col w-full text-center sm:text-left">
            <div className="flex items-start justify-between w-full">
              <div> 
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-0.5">{profile.username}</h1>
                <p className="text-base sm:text-lg text-gray-500">{profile.role}</p>
              </div>

              {/* Edit Button (Desktop/Tablet) */}
              <Button
                variant="icon"
                size="icon"
                onClick={() => {
                  setEditing(!editing);
                  setUsername(profile.username);
                }}
                className="rounded-full hidden sm:flex flex-shrink-0"
              >
                <Edit2 className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Contact Icons */}
            {/* <div className="flex gap-4 items-center mt-4 justify-center sm:justify-start">
              {contactIcons.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Button key={index} variant="contactIcon" title={item.label} className="group">
                    <IconComponent className="w-5 h-5 group-hover:text-blue-600 transition-colors duration-200" />
                  </Button>
                );
              })}
            </div> */}
            {/* Edit Button (Mobile) */}
            <div className="flex sm:hidden justify-center mt-4">
              <Button
                variant="icon"
                size="icon"
                onClick={() => {
                  setEditing(!editing);
                  setUsername(profile.username);
                }}
                className="rounded-full"
              >
                <Edit2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Editing Form - Wrapped in AnimatePresence */}
        <AnimatePresence>
                    {editing && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 pt-6 overflow-hidden"
                        >
                            <div className="space-y-2">
                            <Label htmlFor="username">Your Public Username</Label> {/* FRIENDLY LABEL */}
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a new Creator Name" // FRIENDLY PLACEHOLDER
                            />
                            </div>
                            <div className="flex gap-4">
                            <Button 
                                onClick={handleUpdateProfile} 
                                disabled={loadingUpdate}
                                className="font-bold"
                            >
                                {loadingUpdate ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                                ) : (
                                "Confirm Changes" // FRIENDLY CTA
                                )}
                            </Button>
                            <Button 
                                variant="neumo" 
                                onClick={() => setEditing(false)} 
                            >
                                Not Now
                            </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

        
        {/* Stats/Metrics as raised data blocks */}
        <div className="pt-6">
          <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Your Creator Metrics</h3> {/* FRIENDLY TITLE */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4"> 
            {stats.map((stat, index) => (
              <MetricBadge 
                key={index} 
                icon={stat.icon} 
                label={stat.label} 
                value={stat.value} 
              />
            ))}
          </div>
        </div>

       </Card>
       
      </motion.div>

      {/* RIGHT COLUMN: Activity Card (2/5 width) - Separate Motion */}
      <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2"
            >
        <Card className="p-8 h-full flex flex-col justify-start">
          {/* FRIENDLY TITLE */}
          <h2 className="text-2xl font-bold text-gray-800 pb-3 mb-6 border-b border-blue-200">
          Recent Creative Moves
          </h2>
          
          <div className="flex-grow space-y-4">
            {recentActivities.map((activity, index) => (
              <ActivityItem 
                key={index}
                title={activity.title}
                time={activity.time}
                icon={activity.icon}
                color={activity.color}
              />
            ))}
          </div>
          
          {/* Placeholder for no activity state */}
          {recentActivities.length === 0 && (
            <p className="text-gray-500 text-center py-8">
            Start creating and engaging to see more activity!
            </p>
          )}
        </Card>
      </motion.div>

     </div>
    </motion.div>
   </div>
  </div>
 );
};

export default App;