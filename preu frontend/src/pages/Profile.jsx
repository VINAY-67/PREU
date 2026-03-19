import { useEffect, useState } from "react";
import { User, TrendingUp, MessageSquare, Bookmark, Users, Edit2, Loader2, Zap, CheckCircle, ChevronRight, Star } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { getProfileDetails,updateProfile } from "../core/user";
import confetti from 'canvas-confetti';

// --- NEUMORPHISM COLOR PALETTE & CONSTANTS ---
const NEUMO_BG = "bg-blue-50";
const NEUMO_CARD_BG = "bg-blue-100";
const PRIMARY_ACCENT_TEXT = "text-blue-700";
const CTA_GRADIENT = "bg-gradient-to-r from-cyan-500 to-blue-600";
const CTA_SHADOW = "shadow-xl shadow-cyan-500/30";

const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(174,174,192,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";

// --- NEW COMPONENT: ELITE BADGE (THE "WINNER" TAG) ---


// --- SHARED UI COMPONENTS ---
const Button = ({ children, className = "", variant = "default", size = "md", ...props }) => {
  const baseStyles = "font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center";
  const variants = {
    default: `${CTA_GRADIENT} text-white ${CTA_SHADOW} hover:opacity-95 active:shadow-none`,
    neumo: `${NEUMO_CARD_BG} text-gray-700 ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW} active:shadow-none`,
    icon: `${NEUMO_CARD_BG} text-gray-500 ${PRIMARY_SHADOW} p-3 hover:scale-[1.05] active:${PRESSED_SHADOW} active:shadow-none`,
  };
  const sizes = { sm: "px-3 py-1 text-sm", md: "px-6 py-3", lg: "px-8 py-4 text-lg", icon: "p-3" };
  return (
    <motion.button
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ y: -1, boxShadow: "0 8px 10px rgba(174,174,192,0.6)" }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-4 py-3 ${NEUMO_BG} ${PRESSED_SHADOW} rounded-xl text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className = "", ...props }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-600 ${className}`} {...props}>
    {children}
  </label>
);

const MetricBadge = ({ icon: Icon, label, value, isGold }) => (
  <Card className={`p-4 md:p-5 flex flex-col items-center justify-center w-full h-full text-center border-2 ${isGold ? 'border-yellow-400 bg-yellow-50' : 'border-transparent'}`}>
    <div className="flex items-center space-x-2 mb-2">
      <Icon className={`w-5 h-5 ${isGold ? 'text-yellow-600' : 'text-blue-500'}`} />
      <span className={`text-2xl font-extrabold ${isGold ? 'text-yellow-800' : 'text-gray-800'}`}>{value.toLocaleString()}</span>
    </div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
  </Card>
);

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
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recentActivities] = useState([
    { title: "Rated 'Desert Sunset'", time: "2 hours ago", icon: CheckCircle, color: "text-green-500" },
    { title: "Posted 'Vibrant Cyberpunk'", time: "Yesterday", icon: MessageSquare, color: "text-cyan-500" },
    { title: "Joined 'Sci-Fi Writers' C'", time: "3 days ago", icon: Users, color: "text-indigo-500" },
    { title: "Commented on 'Abstract Art'", time: "1 week ago", icon: MessageSquare, color: "text-yellow-500" },
  ]);

  useEffect(() => {
    fetchProfile();
  }, [profileId]);
  useEffect(() => {
    if (!loading && profile && (profile.popularity_score >= 5)) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        // Fire gold and blue confetti to match PREU branding
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#fbbf24', '#3b82f6'] });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#fbbf24', '#3b82f6'] });
      }, 250);
    }
  }, [loading, profile]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfileDetails(profileId);
      const mockData = {
        username: data.user.username,
        role: data.user.tagname,
        popularity_score: data.rating.overall_rating,
        prompts_posted: data.prompt_posted.length,
        prompts_rated: data.rating.rated,
        communities_joined: data.communities_joined.length,
      };
      setProfile(mockData);
      setUsername(mockData.username);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoadingUpdate(true);
    setError("");
    setSuccessMessage("");
    try {
      setProfile(prev => ({ ...prev, username: username }));
      await updateProfile({username:username})
      setSuccessMessage("Your profile has been successfully updated!");
      setEditing(false);
    } catch (err) {
      setError("Uh oh! We couldn't save your changes. Please try again.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${NEUMO_BG} font-sans`}>
        <div className={`flex items-center space-x-3 ${PRIMARY_ACCENT_TEXT} p-8 rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-xl font-semibold">Gathering your data...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${NEUMO_BG} font-sans`}>
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">We hit a snag loading your profile.</p>
          <Button onClick={fetchProfile}>Try Loading Again</Button>
        </Card>
      </div>
    );
  }

  const isWinner = profile.popularity_score >= 5 || profile.prompts_rated > 100;

  const stats = [
    { icon: Zap, label: "Influence Rank", value: profile.popularity_score || 0, isGold: profile.popularity_score >= 5 },
    { icon: Bookmark, label: "Prompts Saved", value: profile.prompts_posted || 0 },
    { icon: TrendingUp, label: "Ratings Given", value: profile.prompts_rated || 0 },
    { icon: Users, label: "Communities", value: profile.communities_joined || 0 }
  ];

  return (
    <div className={`${NEUMO_BG} text-gray-800 min-h-screen font-sans`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto space-y-8">

          <h1 className="text-4xl font-extrabold text-gray-800 hidden lg:block">PREU Creator Dashboard</h1>

          <AnimatePresence>
            {successMessage && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="p-6 w-full max-w-sm flex flex-col items-center text-center">
                  <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Success!</h3>
                  <p className="text-gray-600 mb-6">{successMessage}</p>
                  <Button onClick={() => setSuccessMessage("")} variant="neumo" className="w-full" size="sm">Awesome!</Button>
                </Card>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 shadow-md">
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isWinner && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 p-[1px] rounded-2xl mb-8">
                  <div className="bg-gray-900 rounded-[15px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-500/20 p-2 rounded-lg">
                        <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-yellow-500 font-black text-xs uppercase tracking-widest">System Achievement</p>
                        <h3 className="text-white font-bold text-lg">Elite Hall of Fame Inductee</h3>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-gray-400 text-xs">Status: <span className="text-green-400">Verified Winner</span></p>
                      <p className="text-gray-500 text-[10px]">Unique ID: PREU-MASTER-{profileId.slice(0, 5)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-3 space-y-8">
              <Card className="p-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-start items-center gap-6 border-b border-blue-200 pb-6">
                  <div className="relative">
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full ${PRIMARY_SHADOW} bg-blue-200 flex items-center justify-center flex-shrink-0 border-4 ${isWinner ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'border-transparent'}`}>
                      <User className={`w-12 h-12 sm:w-14 sm:h-14 ${isWinner ? 'text-yellow-700' : 'text-blue-600'}`} />
                    </div>

                  </div>

                  <div className="flex  w-full text-center sm:text-left">
                    <div className="flex items-start justify-evenly w-full">
                      <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-0.5">{profile.username}</h1>
                          {isWinner && (
                            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Elite Winner</span>
                          )}
                        </div>
                        <p className="text-base sm:text-lg text-gray-500">{profile.role}</p>
                      </div>
                      <Button variant="icon" size="icon" onClick={() => { setEditing(!editing); setUsername(profile.username); }} className="rounded-full hidden sm:flex flex-shrink-0">
                        <Edit2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="flex sm:hidden justify-center mt-4">
                      <Button variant="icon" size="icon" onClick={() => { setEditing(!editing); setUsername(profile.username); }} className="rounded-full">
                        <Edit2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {editing && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-6 overflow-hidden">
                      <div className="space-y-2">
                        <Label htmlFor="username">Public Username</Label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a name" />
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleUpdateProfile} disabled={loadingUpdate}>{loadingUpdate ? "Saving..." : "Confirm Changes"}</Button>
                        <Button variant="neumo" onClick={() => setEditing(false)}>Not Now</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-6">
                  <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Core Metrics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <MetricBadge key={index} icon={stat.icon} label={stat.label} value={stat.value} isGold={stat.isGold} />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-2">
              <Card className="p-8 h-full flex flex-col justify-start">
                <h2 className="text-2xl font-bold text-gray-800 pb-3 mb-6 border-b border-blue-200">Recent Moves</h2>
                <div className="flex-grow space-y-4">
                  {recentActivities.map((activity, index) => (
                    <ActivityItem key={index} title={activity.title} time={activity.time} icon={activity.icon} color={activity.color} />
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default App;