import { useEffect, useState } from "react";
import { Users, TrendingUp, Plus, Loader2, MessageCircle, Send } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom"
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


// --- MOCK DATA ---
const MOCK_COMMUNITIES = [
  { id: "ai_vision", name: "AI Vision & Image Prompts", description: "A highly visual community dedicated to sharing successful text-to-image prompts for mid-journey and similar models.", member_count: 14500, ranking: 1 },
  { id: "code_gen", name: "Code Generation Mastery", description: "Focusing on prompts for generating complex application logic, code debugging, and infrastructure-as-code snippets.", member_count: 8200, ranking: 2 },
  { id: "data_sci", name: "Data Science & Analysis", description: "Sharing prompts for complex statistical modeling, predictive analytics, and generating actionable insights from raw data.", member_count: 4900, ranking: 3 },
  { id: "fiction_pro", name: "Professional Fiction Writers", description: "For novelists and screenwriters using AI to draft characters, outline plots, and refine dialogue.", member_count: 2100, ranking: 4 },
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger delay between children
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom ease for a soft bounce
    },
  },
};


// --- COMPONENTS ---

// Button Component (Neumorphic Style with Motion)
const Button = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: `${CTA_GRADIENT} text-white ${CTA_SHADOW} hover:opacity-95 active:shadow-none`,
    neumo: `${NEUMO_CARD_BG} ${PRIMARY_ACCENT_TEXT} ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW} active:shadow-none`,
  };
  return (
    <motion.button
      whileTap={{ scale: props.disabled ? 1 : 0.98 }} // Added motion effect
      className={`font-semibold rounded-xl transition-all duration-300 px-6 py-3 flex items-center justify-center ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Card Component (Neumorphic Style with Motion)
const Card = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: "0 10px 15px rgba(174,174,192,0.6)" }} // Lift effect on hover
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);
// --- NEW COMPONENT: Toast Message ---
const Toast = ({ message, isVisible, onClose, Button }) => {
  // Neumorphic Styling for the Toast
  const TOAST_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.6),-6px_-6px_12px_rgba(255,255,255,1)]";
  const TOAST_BG = "bg-blue-100";
  const TOAST_TEXT = "text-blue-700";

  // Set a timeout to automatically close the toast after 4 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className={`fixed bottom-4 right-4 z-[100] p-4 ${TOAST_BG} ${TOAST_TEXT} rounded-xl ${TOAST_SHADOW} flex items-center space-x-3`}
        >
          <Send className="w-5 h-5" />
          <span className="font-semibold text-sm sm:text-base">{message}</span>

          {/* Neumorphic Close Button */}
          <Button
            variant="neumo"
            onClick={onClose}
            className="w-7 h-7 p-0 ml-4 text-gray-500 text-lg font-light shadow-none active:shadow-none"
          >
            &times;
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const Input = ({ icon: Icon, className = "", ...props }) => (
  <div className="relative w-full">
    <div className={`absolute left-0 top-0 bottom-0 flex items-center pl-3 ${PRIMARY_ACCENT_TEXT}`}>
      {Icon && <Icon className="w-5 h-5 opacity-70" />}
    </div>
    <input
      className={`w-full px-4 py-3 border border-blue-200 ${NEUMO_BG} rounded-xl text-gray-800 
                        ${PRESSED_SHADOW} focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                        placeholder:text-gray-400 transition-all duration-200 
                        ${Icon ? 'pl-10' : ''} ${className}`}
      {...props}
    />
  </div>
);


// CreateCommunityModal (Integrated)
const CreateCommunityModal = ({ isVisible, onClose, onSuccess, Button, Input }) => {
  // Local Storage Key
  const STORAGE_KEY = 'communityProposalData';

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    // Load saved data, or use defaults
    return savedData ? JSON.parse(savedData) : {
      name: "",
      contentType: "text",
      motive: "educational",
      proposal: "",
      canManage: false,
      agreed: false,
    };
  });
  const [submitting, setSubmitting] = useState(false);

  // Effect to save data to local storage whenever formData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      localStorage.removeItem(STORAGE_KEY);
      onSuccess();
    }, 2000);
  };

  if (!isVisible) return null;

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden: { y: "100vh" }, // Start off-screen vertically for better mobile entry
    visible: { y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
    exit: { y: "100vh" },
  };

  // --- STYLING CONSTANTS (Updated for Modern Look) ---
  const INPUT_STYLE = `w-full px-2 py-1 border border-blue-300 bg-white/70 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`;
  const CHECKBOX_COLOR = `rounded border-blue-400 text-blue-600 focus:ring-blue-50`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="modalBackdrop"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            key="modalPanel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            // 👇 CLEAN MODAL PANEL: White background, smooth border, subtle shadow
            className={`w-full max-w-lg rounded-xl bg-blue-50 shadow-2xl relative`}
          >
            <div className="p-6 sm:p-8 space-y-6">

              {/* Close Button (Modernized Styling) */}
              <Button
                variant="neumo" // Keeping 'neumo' for inherited styles, but overriding shadow
                className="absolute top-4 right-4 w-10 h-10 p-0 text-xl font-light text-gray-700 bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                &times;
              </Button>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b border-blue-200 pb-3 pr-10">
                <Plus className={`inline-block w-6 h-6 mr-2 ${PRIMARY_ACCENT_TEXT}`} />
                New Community
              </h2>
              //here i need to check to send this to the admin dahsboard
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Community Name</label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="e.g., Advanced RAG Techniques"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className={INPUT_STYLE} // Applying new style
                  />
                </div>

                {/* Type of content */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Type of Content</label>
                  <select
                    name="type"
                    value={formData.contentType}
                    onChange={handleChange}
                    className={INPUT_STYLE} // Applying new style
                    required
                    disabled={submitting}
                  >
                    <option value="text">Text Prompting</option>
                    <option value="image">Image Generation</option>
                    <option value="code">Code Generation</option>
                    <option value="data">Data Science</option>
                  </select>
                </div>


                {/* Motive */}
                <div>

                  <label className="text-sm font-semibold text-gray-700 block mb-1">Motive</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center text-gray-600 cursor-pointer">
                      <input type="radio" name="motive" value="educational" checked={formData.motive === 'educational'} onChange={handleChange} className={`mr-2 ${CHECKBOX_COLOR}`} disabled={submitting} /> Educational
                    </label>
                    <label className="flex items-center text-gray-600 cursor-pointer">
                      <input type="radio" name="motive" value="commercial" checked={formData.motive === 'commercial'} onChange={handleChange} className={`mr-2 ${CHECKBOX_COLOR}`} disabled={submitting} /> Commercial
                    </label>
                  </div>
                </div>

                {/* Proposal */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Proposal / Usefulness (Min. 50 words)</label>
                  <textarea
                    name="proposal"
                    rows="3"
                    placeholder="Explain how this community will be useful and unique."
                    value={formData.proposal}
                    onChange={handleChange}
                    minLength={50} // Ensure this is present
                    className={INPUT_STYLE} // Applying new style
                    required
                    disabled={submitting}
                  ></textarea>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center text-gray-700 cursor-pointer text-sm font-semibold">
                    <input type="checkbox" name="canManage" checked={formData.canManage} onChange={handleChange} className={`mr-2 ${CHECKBOX_COLOR}`} disabled={submitting} /> I am able to actively manage and moderate this community.
                  </label>
                  <label className="flex items-center text-gray-700 cursor-pointer text-sm font-semibold">
                    <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} className={`mr-2 ${CHECKBOX_COLOR}`} required disabled={submitting} /> I agree to the Community Proposal Terms & Guidelines.
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 mt-6"
                  disabled={submitting  || formData.proposal.length < 50} // Ensure this logic is present
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Proposal...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" /> Submit for Review
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// Community Item Renderer (Now uses itemVariants for staggering)
const CommunityItem = ({ community, handleJoin, handleUnjoin, handleView, joining, isJoined, unjoining }) => {
  const isJoiningState = joining === community.id;
  const isUnjoiningState = unjoining === community.id;

  return (
    <motion.div variants={itemVariants} className="h-full"> {/* Applied itemVariants */}
      <Card className="p-6 h-full flex flex-col justify-between">
        <div className="flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-4">
            {/* Icon Circle */}
            <div className="p-3 rounded-full bg-blue-50 border border-blue-200 shadow-inner">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            {/* Members Count */}
            <div className="flex items-center gap-1 text-md font-semibold text-cyan-600">
              <TrendingUp className="w-4 h-4" />
              <span>{community.member_count.toLocaleString()} Members</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-gray-800">{community.name}</h3>
          <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
            {community.description || "A dedicated community for sharing high-quality, specialized AI prompts."}
          </p>
        </div>

        {/* Buttons Section - Conditional Rendering */}
        {isJoined ? (
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => handleView(community.id)}
              variant="default"
              className="flex-1 h-12"
            >
              View
            </Button>
            <Button
              onClick={() => handleUnjoin(community.id)}
              variant="neumo"
              disabled={isUnjoiningState}
              className="flex-1 h-12"
            >
              {isUnjoiningState ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Unjoining...
                </>
              ) : (
                "Unjoin"
              )}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => handleJoin(community.id)}
            variant="neumo"
            disabled={isJoiningState}
            className="w-full h-12 mt-4"
          >
            {isJoiningState ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Community
              </>
            )}
          </Button>
        )}
      </Card>
    </motion.div>
  );
}


const App = () => {
  const navigate = useNavigate()
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [unjoining, setUnjoining] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchCommunities();
    // Load joined communities from localStorage on mount
    const savedJoinedCommunities = localStorage.getItem('joinedCommunities');
    if (savedJoinedCommunities) {
      setJoinedCommunities(JSON.parse(savedJoinedCommunities));
    }
  }, []);

  // Mock function to simulate fetching data
  const fetchCommunities = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      setCommunities(MOCK_COMMUNITIES);
    } catch (err) {
      setError("Failed to load communities.");
    } finally {
      setLoading(false);
    }
  };

  // Mock function to simulate joining a community
  const handleJoinCommunity = async (communityId) => {
    setJoining(communityId);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Get the community name
      const community = communities.find(c => c.id === communityId);
      const communityName = community?.name || communityId;

      // Add to joined communities array
      const updatedJoinedCommunities = [...joinedCommunities, communityName];
      setJoinedCommunities(updatedJoinedCommunities);

      // Save to localStorage
      localStorage.setItem('joinedCommunities', JSON.stringify(updatedJoinedCommunities));

      // Update the member count locally
      setCommunities(prev =>
        prev.map(c =>
          c.id === communityId ? { ...c, member_count: c.member_count + 1 } : c
        )
      );

      // Show success toast
      setToastMessage(`Successfully joined ${communityName}!`);
      setIsToastVisible(true);
    } catch (err) {
      setError("Failed to join community. Please try again.");
    } finally {
      setJoining(null);
    }
  };

  // Mock function to simulate unjoining a community
  const handleUnjoinCommunity = async (communityId) => {
    setUnjoining(communityId);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Get the community name
      const community = communities.find(c => c.id === communityId);
      const communityName = community?.name || communityId;

      // Remove from joined communities array
      const updatedJoinedCommunities = joinedCommunities.filter(name => name !== communityName);
      setJoinedCommunities(updatedJoinedCommunities);

      // Save to localStorage
      localStorage.setItem('joinedCommunities', JSON.stringify(updatedJoinedCommunities));

      // Update the member count locally
      setCommunities(prev =>
        prev.map(c =>
          c.id === communityId ? { ...c, member_count: Math.max(0, c.member_count - 1) } : c
        )
      );

      // Show success toast
      setToastMessage(`Left ${communityName}.`);
      setIsToastVisible(true);
    } catch (err) {
      setError("Failed to leave community. Please try again.");
    } finally {
      setUnjoining(null);
    }
  };

  // Mock function to view community
  const handleViewCommunity = (communityId) => {
    navigate(`/communities/community`);
  };

  // Loading Animation for the whole screen
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${NEUMO_BG} font-sans`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`flex items-center space-x-3 ${PRIMARY_ACCENT_TEXT} p-8 rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW}`}
        >
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-xl font-semibold">Loading Communities...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${NEUMO_BG} text-gray-800 min-h-screen font-sans`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Header Section - Applied Motion */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between border-b border-blue-200 pb-6"
          >
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Community Hub
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Join prompt communities, share ideas, and explore the best content.
              </p>
            </div>
            <Button
              className="h-12 px-8 font-bold"
              onClick={() => {
                setIsModalOpen(true);
                setIsToastVisible(false); // Clear previous message
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Community
            </Button>
          </motion.div>

          {/* Error Message - Wrapped in AnimatePresence for smooth appearance/disappearance */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-red-100 border border-red-400 rounded-xl text-red-700 shadow-md"
              >
                {error}
              </motion.div>
            )}

          </AnimatePresence>

          {/* 👇 NEW MODAL RENDERING */}
          <CreateCommunityModal
            isVisible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              setIsToastVisible(true); // Show the success note
            }}
            // Pass existing component definitions
            Button={Button}
            Input={Input}
          />
          {/* 👆 END NEW MODAL RENDERING */}


          {/* Community Grid - Applied Staggered Motion */}
          {communities.length === 0 ? (
            <Card className="p-16 text-center shadow-xl">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">No Approved Communities</h3>
              <p className="text-gray-600">
                Be the first to create a community, or check back later!
              </p>
            </Card>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {communities.map((community) => (
                <CommunityItem
                  key={community.id}
                  community={community}
                  handleJoin={handleJoinCommunity}
                  handleUnjoin={handleUnjoinCommunity}
                  handleView={handleViewCommunity}
                  joining={joining}
                  unjoining={unjoining}
                  isJoined={joinedCommunities.includes(community.name)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        Button={Button}
      />
    </div>

  );
};

export default App;