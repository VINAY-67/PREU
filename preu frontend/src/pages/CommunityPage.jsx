import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Bookmark,
  Plus,
  Loader2,
  ChevronDown,
  Heart,
  Tag,
  Users,
  X,
  Send,
  Code,
  ImageIcon,
  ListOrdered,
  Copy,
  Check
} from "lucide-react";
const NEUMO_BG = "bg-blue-50";
const NEUMO_CARD_BG = "bg-blue-100";
const PRIMARY_ACCENT_TEXT = "text-blue-700";
const CTA_GRADIENT = "bg-gradient-to-r from-cyan-500 to-blue-600";
const CTA_SHADOW = "shadow-xl shadow-cyan-500/30";

const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(174,174,192,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";
const INNER_SHADOW = "shadow-[inset_2px_2px_4px_rgba(174,174,192,0.4),inset_-2px_-2px_4px_rgba(255,255,255,1)]";

const MOCK_COMMUNITIES = {
  "ai_vision": { name: "AI Vision & Image Prompts", description: "Sharing successful text-to-image prompts.", member_count: 14500, icon: ImageIcon },
  "code_gen": { name: "Code Generation Mastery", description: "Prompts for complex application logic and snippets.", member_count: 8200, icon: Code },
};

const MOCK_PROMPTS = [
  { id: 1, 
    title: "Epic Cyberpunk Cityscape Prompt", 
    prompt: "A vast, neon-drenched futuristic city at night, rain-slicked streets reflecting bright signs, volumetric lighting, 8k, highly detailed.", 
    author: "PromptGenius", 
    rating: 4.8, 
    comments: 45, 
    bookmarks: 120, 
    tags: ["MidJourney", "Sci-Fi", "Visual"], 
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202311/2812/ae84720b553c4ce943e9c342621b60f198beda0dbf533e21.jpg", 
    date: new Date(Date.now() - 3600000) 
  },
  { id: 2, title: "React Component Hook Generator", prompt: "Generate a custom React hook that handles form validation for email and password inputs, returning state and validation errors.", author: "CodeMaster", rating: 4.5, comments: 22, bookmarks: 80, tags: ["React", "JavaScript", "Code"], image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", date: new Date(Date.now() - 86400000) },
  { id: 3, title: "Realistic Portrait of an Old Scholar", prompt: "A hyper-realistic digital painting of an elderly man with kind eyes, reading a leather-bound book by soft candlelight. High detail.", author: "VisualArtist", rating: 4.9, comments: 60, bookmarks: 150, tags: ["StableDiffusion", "Portrait", "Realistic"], image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", date: new Date(Date.now() - 172800000) },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "top_rated", label: "Top Rated" },
  { value: "most_bookmarked", label: "Most Bookmarked" },
];

// --- COMPONENTS (Shared & Re-used) ---

const Button = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: `${CTA_GRADIENT} text-white ${CTA_SHADOW} hover:opacity-95 active:shadow-none`,
    neumo: `${NEUMO_CARD_BG} ${PRIMARY_ACCENT_TEXT} ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW} active:shadow-none`,
    neumoInverse: `bg-blue-50 text-gray-700 ${INNER_SHADOW} hover:bg-blue-100 active:${PRESSED_SHADOW} active:shadow-none`,
  };
  return (
    <motion.button
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className={`font-semibold rounded-xl transition-all duration-300 px-6 py-3 flex items-center justify-center ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: "0 10px 15px rgba(174,174,192,0.6)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const Modal = ({ isOpen, onClose, children, title }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-blue-50/70"
      >
        <motion.div
          initial={{ y: -50, scale: 0.9 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: -50, scale: 0.9 }}
          className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} p-8 w-full max-w-lg mx-4`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-blue-200 pb-4">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <Button onClick={onClose} variant="neumoInverse" className="p-3 w-auto h-auto rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Prompt Post Renderer 
const PromptPost = ({ prompt }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-amber-500 text-amber-500" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-amber-300 text-amber-500" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  return (
    <Card className="p-6 transition-transform duration-300 h-full flex flex-col">
      <div className="flex-grow">
        <h4 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{prompt.title}</h4>
        <p className="text-sm font-medium text-gray-500 mb-4">By **{prompt.author}**</p>
        {prompt.image && (
          <div className="mb-4 w-full h-48 rounded-xl overflow-hidden shadow-sm">
            <img src={prompt.image} alt={prompt.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className={`p-4 mb-4 rounded-xl text-sm bg-blue-50 ${INNER_SHADOW} text-gray-700 font-mono overflow-auto max-h-32 relative group`}>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">{prompt.prompt}</div>
            <button
              onClick={handleCopyPrompt}
              className="flex-shrink-0 p-2 rounded-lg bg-blue-200 hover:bg-blue-300 text-blue-700 transition-colors duration-200 "
              title="Copy prompt"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-3 py-1 rounded-xl bg-blue-200 text-blue-800 shadow-inner flex items-center"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-blue-200 mt-auto">
        <div className="flex items-center space-x-4">
          {/* Rating */}
          <div className="flex items-center text-md font-semibold text-amber-500">
            <div className="flex mr-1">{renderStars(prompt.rating)}</div>
            <span>{prompt.rating.toFixed(1)}</span>
          </div>
          {/* The comments button was removed from here */}
        </div>

        <div className="flex space-x-3">
          <Button
            variant="neumoInverse"
            className="p-3 w-auto h-auto rounded-full"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className={`w-5 h-5 transition-colors ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'}`} />
          </Button>
          <Button
            variant="neumoInverse"
            className="p-3 w-auto h-auto rounded-full"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
};


// --- MAIN PAGE COMPONENT ---
const CommunityPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const communityId = location.state?.communityId || Object.keys(MOCK_COMMUNITIES)[0];

  const [community, setCommunity] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const [newPromptTitle, setNewPromptTitle] = useState("");
  const [newPromptText, setNewPromptText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPromptTagInput, setNewPromptTagInput] = useState("");
  const [newPromptTags, setNewPromptTags] = useState([]);
  const [newPromptImageUrl, setNewPromptImageUrl] = useState("");

  useEffect(() => {
    if (!communityId) {
      navigate('/communities');
      return;
    }

    const fetchCommunityData = () => {
      setLoading(true);
      setTimeout(() => {
        const commData = MOCK_COMMUNITIES[communityId];
        if (commData) {
          setCommunity(commData);
          setPrompts(sortPrompts(MOCK_PROMPTS, sortOption));
          setLoading(false);
        } else {
          navigate('/communities');
        }
      }, 800);
    };

    fetchCommunityData();
  }, [communityId, navigate, sortOption]);

  const sortPrompts = (data, sort) => {
    const sorted = [...data];
    switch (sort) {
      case "top_rated":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "most_bookmarked":
        return sorted.sort((a, b) => b.bookmarks - a.bookmarks);
      case "latest":
      default:
        return sorted.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setIsSortModalOpen(false);
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const parts = value.split(',');
      const newTag = parts[0].trim();
      if (newTag && newTag.length > 0 && newPromptTags.length < 5) {
        setNewPromptTags([...newPromptTags, newTag]);
      }
      setNewPromptTagInput(parts[parts.length - 1].trim());
    } else {
      setNewPromptTagInput(value);
    }
  };

  const removeTag = (index) => {
    setNewPromptTags(newPromptTags.filter((_, i) => i !== index));
  };
  
  const handleTagInputBlur = () => {
    if (newPromptTagInput.trim() && newPromptTags.length < 5) {
      if (!newPromptTags.includes(newPromptTagInput.trim())) {
        setNewPromptTags([...newPromptTags, newPromptTagInput.trim()]);
      }
      setNewPromptTagInput("");
    }
  };

  const handleSubmitPrompt = async (e) => {
    e.preventDefault();
    if (!newPromptText.trim() || !newPromptTitle.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newPrompt = {
      id: Date.now(), // Unique identifier - timestamp used as unique ID for each prompt
      title: newPromptTitle.trim(), // User-entered title of the prompt (max ~50 chars recommended)
      prompt: newPromptText, // The full prompt content/text that users will see and use
      author: "You", // Name of the person who posted the prompt
      rating: 5.0, // Initial rating (new prompts start at 5.0)
      comments: 0, // Number of comments on this prompt (starts at 0 for new posts)
      bookmarks: 0, // Number of times users have bookmarked this prompt (starts at 0)
      tags: newPromptTags.length > 0 ? newPromptTags : ["New", "Custom"], // Categories/keywords for the prompt
      image: newPromptImageUrl.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Using 'image' as per schema
      date: new Date(), // Timestamp of when the prompt was created
    };

    setPrompts(prev => sortPrompts([newPrompt, ...prev], sortOption));
    setNewPromptTitle("");
    setNewPromptText("");
    setNewPromptTagInput("");
    setNewPromptTags([]);
    setNewPromptImageUrl("");
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  // --- Loading State ---
  if (loading || !communityId) {
    const loadingText = communityId ? `Entering ${communityId}...` : `Loading Community...`;
    return (
      <div className={`min-h-screen flex items-center justify-center ${NEUMO_BG} font-sans`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`flex items-center space-x-3 ${PRIMARY_ACCENT_TEXT} p-8 rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW}`}
        >
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-xl font-semibold">{loadingText}</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${NEUMO_BG} text-gray-800 min-h-screen font-sans`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Header Section */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between border-b border-blue-200 pb-6"
          >
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                {community.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1 flex items-center justify-center sm:justify-start">
                <Users className="w-4 h-4 mr-1 text-blue-500" />
                {community.member_count.toLocaleString()} Members
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* Desktop-only back button */}
              <Button
                onClick={() => navigate('/communities')}
                variant="neumoInverse"
                className="p-3 w-auto h-auto rounded-full shadow-lg hidden md:flex"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="h-12 px-8 font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Post
              </Button>
            </div>
          </motion.div>
              <Button
                onClick={() => navigate('/communities')}
                variant="neumoInverse"
                className="p-3 w-auto h-auto rounded-full shadow-lg md:hidden "
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
          {/* Controls: Sorting (Adjusted for mobile button) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex justify-between items-center"
          >
            
            <h3 className="text-xl font-bold text-gray-800">Community Prompts</h3>

            {/* Mobile Sort Button */}
            <Button
              onClick={() => setIsSortModalOpen(true)}
              variant="neumoInverse"
              className="md:hidden h-10 px-4 py-2 text-sm"
            >
              <ListOrdered className="w-4 h-4 mr-2" />
              Sort: {SORT_OPTIONS.find(o => o.value === sortOption).label}
            </Button>

            {/* Desktop Sort Dropdown (Existing) */}
            <div className="hidden md:flex items-center">
              <label htmlFor="sort" className="text-sm font-medium text-gray-600 mr-3">
                Sort Prompts By:
              </label>
              <div className={`relative ${PRIMARY_SHADOW} rounded-xl`}>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`appearance-none bg-blue-100 py-2 pl-4 pr-10 text-gray-700 font-semibold rounded-xl focus:outline-none transition-all duration-200 ${INNER_SHADOW}`}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none" />
              </div>
            </div>

          </motion.div>

          {/* Prompts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
          >
            <AnimatePresence>
              {prompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <PromptPost prompt={prompt} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { if (!isSubmitting) setIsModalOpen(false); }}
        title={`Share your Prompt `}
      >
//here we need to come for sending the request after entering the data
        <form onSubmit={handleSubmitPrompt}>
          {/* 0. Title Input (NEW FIELD) */}
          <label htmlFor="prompt-title" className="block text-md font-semibold text-gray-700 mb-2">
            Prompt Title:
          </label>
          <input
            id="prompt-title"
            type="text"
            value={newPromptTitle}
            onChange={(e) => setNewPromptTitle(e.target.value)}
            placeholder="e.g., Epic Cyberpunk Cityscape Prompt"
            maxLength="100"
            className={`w-full p-3 mb-4 rounded-xl text-gray-700 bg-blue-50 focus:outline-none transition-all duration-200 ${INNER_SHADOW}`}
            disabled={isSubmitting}
            required
          />

          {/* 1. Prompt Text Area (Existing) */}
          <label htmlFor="prompt-text" className="block text-md font-semibold text-gray-700 mb-2">
            Paste Your Prompt Here:
          </label>
          <textarea
            id="prompt-text"
            value={newPromptText}
            onChange={(e) => setNewPromptText(e.target.value)}
            rows="6"
            placeholder="E.g., 'A vast, neon-drenched futuristic city...' or 'Generate a custom React hook...'"
            className={`w-full p-4 mb-4 rounded-xl text-gray-700 bg-blue-50 focus:outline-none transition-all duration-200 resize-none ${INNER_SHADOW}`}
            disabled={isSubmitting}
            required
          />

          {/* 2. Tags Input (Dynamic Tags with YouTube-style UI) */}
          <label htmlFor="prompt-tags" className="block text-md font-semibold text-gray-700 mb-2">
            Tags (comma-separated, max 5):
          </label>
          <div className={`w-full p-3 mb-4 rounded-xl bg-blue-50 focus:outline-none transition-all duration-200 ${INNER_SHADOW} flex flex-wrap gap-2 items-center`}>
            {newPromptTags.map((tag, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 hover:bg-blue-600 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            <input
              id="prompt-tags"
              type="text"
              value={newPromptTagInput}
              onChange={handleTagInputChange}
              onBlur={handleTagInputBlur}
              placeholder={newPromptTags.length >= 5 ? "Max 5 tags reached" : "e.g., MidJourney, Sci-Fi..."}
              disabled={isSubmitting || newPromptTags.length >= 5}
              className="flex-1 min-w-[100px] bg-transparent focus:outline-none text-gray-700"
            />
          </div>

          {/* 3. Image URL Input (NEW FIELD) */}
          <label htmlFor="prompt-image" className="block text-md font-semibold text-gray-700 mb-2">
            Image (Optional) :
          </label>
          <input
            id="prompt-image"
            type="file"
            value={newPromptImageUrl}
            onChange={(e) => setNewPromptImageUrl(e.target.value)}
            className={`w-full p-3 mb-6 rounded-xl text-gray-700 bg-blue-50 focus:outline-none transition-all duration-200 ${INNER_SHADOW}`}
            disabled={isSubmitting}
          />

          {/* 4. Submission Button (Existing) */}
          <Button
            type="submit"
            className="w-full h-12 font-bold"
            disabled={isSubmitting || !newPromptText.trim() || !newPromptTitle.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Share Prompt
              </>
            )}
          </Button>
        </form>
      </Modal>

      {/* Mobile Sort Modal */}
      <Modal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        title="Sort Prompts"
      >
        <div className="space-y-3">
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={sortOption === option.value ? "default" : "neumoInverse"}
              onClick={() => handleSortChange(option.value)}
              className="w-full justify-start h-12 px-4"
            >
              <ListOrdered className="w-4 h-4 mr-3" />
              <span className="flex-grow text-left">{option.label}</span>
              {sortOption === option.value && <Star className="w-4 h-4 fill-white text-white ml-2" />}
            </Button>
          ))}
        </div>
      </Modal>

    </div>
  );
};

export default CommunityPage;