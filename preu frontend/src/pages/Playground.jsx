import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, TrendingUp, Search, Loader2, ChevronDown, Plus } from "lucide-react";
import React from "react"; 
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- NEUMORPHISM COLOR PALETTE & CONSTANTS (Pale Sky Blue Theme) ---
const NEUMO_BG = "bg-blue-50"; 
const NEUMO_CARD_BG = "bg-blue-100"; 
const PRIMARY_ACCENT_TEXT = "text-blue-700"; 
const CTA_GRADIENT = "bg-gradient-to-r from-cyan-500 to-blue-600"; 
const CTA_SHADOW = "shadow-xl shadow-cyan-500/30";
const NEUMO_GRAY = "bg-gray-200/50"; 

// Neumorphic Shadows (Convex/Raised)
const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
// Neumorphic Shadows (Concave/Pressed)
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(174,174,192,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";


// --- Motion Button Component ---
const Button = ({ children, className = "", variant = "default", ...props }) => {
    const baseStyles = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center";
    const variants = {
        default: `${CTA_GRADIENT} text-white ${CTA_SHADOW} hover:opacity-95 active:shadow-none`,
        neumo: `${NEUMO_CARD_BG} text-gray-800 ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW} active:shadow-none`,
        outline: "border-2 border-blue-200 text-blue-700 hover:bg-blue-100", 
        icon: "bg-transparent text-gray-600 hover:text-blue-600 p-2 rounded-full",
    };
    return (
        <motion.button 
            whileTap={{ scale: props.disabled ? 1 : (variant === "icon" ? 0.9 : 0.98) }}
            className={`${baseStyles} ${variants[variant]} ${className}`} 
            {...props}
        >
            {children}
        </motion.button>
    );
};

// --- Motion Card Component ---
const Card = ({ children, className = "", ...props }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} p-6 sm:p-8 ${className}`}
        {...props}
    >
        {children}
    </motion.div>
);

// Textarea Component 
const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
    <textarea 
        ref={ref}
        className={`w-full h-full p-3 resize-none bg-transparent text-gray-800 placeholder:text-gray-500 focus:outline-none ${className}`} 
        rows={1}
        {...props} 
    />
));
Textarea.displayName = 'Textarea';

// --- Select Components (Simplified, preserving motion) ---
const Select = ({ value, onValueChange, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [containerRef]);

    const handleSelect = (newValue) => {
        onValueChange(newValue);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative z-30"> 
            {React.Children.map(children, (child) => {
                const childType = child.type?.name;
                
                if (childType === "SelectTrigger") {
                    return React.cloneElement(child, {
                        onClick: () => setIsOpen(!isOpen),
                        key: child.key || 'trigger',
                    });
                } else if (childType === "SelectContent") {
                    return (
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div 
                                    key={child.key || 'content'} 
                                    className="absolute bottom-full left-0 mb-2 w-max min-w-[200px] origin-bottom-left"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {React.cloneElement(child, { handleSelect: handleSelect })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    );
                }
                return null;
            })}
        </div>
    );
};

const SelectTrigger = ({ children, className = "", onClick, ...props }) => (
    <motion.button 
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`px-3 py-1.5 border border-blue-300 ${NEUMO_CARD_BG} rounded-full text-left flex justify-between items-center text-gray-800 font-medium text-sm transition-all hover:bg-blue-200 ${className}`}
        {...props}
    >
        {children}
        <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />
    </motion.button>
);

const SelectValue = ({ children }) => (
    <span className="flex items-center">
        <Sparkles className="inline w-3 h-3 mr-1 text-blue-500" />
        <span className={children ? "text-gray-800" : "text-gray-500"}>
            {children || "Target Sector"}
        </span>
    </span>
);

const SelectContent = ({ children, className = "", handleSelect }) => (
    <div className={`${NEUMO_CARD_BG} border border-blue-200 rounded-xl ${PRIMARY_SHADOW} shadow-xl max-h-60 overflow-y-auto p-1 ${className}`}>
        {React.Children.map(children, (child) => {
            if (child.type?.name === "SelectItem") {
                return React.cloneElement(child, {
                    onClick: () => handleSelect(child.props.value),
                    key: child.key || child.props.value,
                });
            }
            return child;
        })}
    </div>
);

const SelectItem = ({ value, children, onClick, className = "" }) => (
    <motion.button 
        whileHover={{ backgroundColor: '#DBEAFE' }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={`block w-full text-left px-3 py-2 text-gray-800 rounded-lg transition-colors text-sm ${className}`}
    >
        {children}
    </motion.button>
);


// --- PROMPT INPUT COMPONENT ---
const PromptInput = ({ prompt, setPrompt, selectedSector, setSelectedSector, sectors, handleRate, loading, error }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [prompt]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!loading && prompt.trim() && selectedSector) {
                handleRate();
            }
        }
    };

    const currentSector = sectors.find(s => s.id === selectedSector);

    return (
        <div className="max-w-xl w-full mx-auto fixed bottom-0 left-0 right-0 px-4 pb-4 md:pb-6 z-10"> 
            
            {/* Sector Toggle / Options Bar */}
            <div className="flex justify-between mb-2">
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="shadow-lg shadow-blue-500/10">
                        <SelectValue>
                             {currentSector ? currentSector.name : ''}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {sectors.map((sector) => (
                            <SelectItem 
                                key={sector.id} 
                                value={sector.id}
                            >
                                 {sector.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            {/* Main Prompt Bar Container */}
            <div className={`relative flex items-end p-2 rounded-3xl ${NEUMO_GRAY} ${PRIMARY_SHADOW} transition-shadow duration-300 focus-within:shadow-xl focus-within:shadow-blue-500/30`}> 
                
                {/* Textarea Input - FRIENDLY PLACEHOLDER */}
                <Textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your best prompt here"
                    className="max-h-[200px] min-h-[44px] flex-grow"
                />

                
                <Button
                    onClick={handleRate}
                    disabled={loading || !prompt.trim() || !selectedSector}
                    className={`ml-2 h-10 w-10 p-0 mb-1 flex-shrink-0 rounded-xl ${CTA_GRADIENT} ${CTA_SHADOW} ${loading || !prompt.trim() ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </Button>
            </div>
            
            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="p-3 mt-2 text-center bg-red-100 border border-red-400 rounded-xl text-red-700 text-sm shadow-md"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const Playground = () => {
    const [prompt, setPrompt] = useState("");
    const [selectedSector, setSelectedSector] = useState("creative");
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(null);
    const [error, setError] = useState("");

    // Mock data and API functions
    useEffect(() => {
        const mockSectors = [
            { id: 'tech', name: 'Technology & AI' },
            { id: 'finance', name: 'Finance & Trading' },
            { id: 'creative', name: 'Creative Writing' },
            { id: 'medical', name: 'Medical Research' },
            { id: 'other', name: 'Other' },
        ];
        
        const fetchSectors = async () => {
            setSectors(mockSectors);
            setError("");
        };
        fetchSectors();
    }, []);

    const handleRate = async () => {
        if (!prompt.trim() || !selectedSector) {
            setError("Oops! Please enter your prompt and select a sector first."); // FRIENDLY ERROR MESSAGE
            return;
        }

        setLoading(true);
        setError("");
        setRating(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); 

            const mockRating = {
                rating: (Math.random() * (4.9 - 3.5) + 3.5).toFixed(2),
                explanation: ` the prompt you have given was \n ${prompt} Your prompt is highly specific, which is crucial for maximizing AI output quality. The inclusion of clear constraints, like style, tone, and audience, ensures the generated content is focused and relevant to the '${sectors.find(s => s.id === selectedSector)?.name || 'General'}' sector. Consider refining the tone further for a perfect 5.0!`,
            };

            setRating(mockRating);
        } catch (err) {
            setError(err.message || "Uh oh! We couldn't rate your prompt. Please try again in a moment."); // FRIENDLY ERROR MESSAGE
        } finally {
            setLoading(false);
        }
    };
    
    const promptBarOffset = 'min-h-[85vh] pb-[12rem] sm:pb-[10rem]'; 
    const navigate=useNavigate()
    
    return (
        <div className={`min-h-screen ${NEUMO_BG} text-gray-800 font-sans`}>
            <div className={`container mx-auto px-4 py-12 md:py-16 ${promptBarOffset}`}>
                <div className="max-w-4xl mx-auto space-y-10">
                    
                    {/* Header - FRIENDLY TITLES */}
                    <motion.div 
                        className="text-center space-y-2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* CHANGED TERMINOLOGY */}
                        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent py-5">
                            Rate Your AI Prompt's Power
                        </h1>
                        {/* CHANGED TERMINOLOGY */}
                        <p className="text-md sm:text-lg text-gray-600 ">
                            See the score your prompt gets and learn how to make it unstoppable.
                        </p>
                    </motion.div>
                    
                    {/* Rating Card */}
                    <AnimatePresence mode="wait">
                        {rating && (
                            <Card key="rating-card" className="p-6 sm:p-8 space-y-4 shadow-2xl shadow-blue-500/20 ">
                                <div className="flex items-center gap-2 pb-2 border-b border-blue-300">
                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    {/* CHANGED TERMINOLOGY */}
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Your Prompt's Instant Score & Review</h3>
                                </div>
                                <div className="flex items-center gap-6 py-2">
                                    <div className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                        {rating.rating}
                                    </div>
                                    <div className="text-sm sm:text-md text-gray-600 self-end">out of 5.00</div>
                                </div>
                                <p className="text-gray-700 font-medium pt-2 text-sm sm:text-base">What the AI thinks:</p>
                                <motion.p 
                                    className="text-gray-600 leading-relaxed italic border-l-4 border-blue-500/50 pl-4 text-sm"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    {rating.explanation}
                                </motion.p>
                            </Card>
                        )}
                    </AnimatePresence>
                    
                    {/* Explore Button - FRIENDLY CALL TO ACTION */}
                    <motion.div 
                        className="text-center pt-4  "
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Button
                            variant="neumo"
                            onClick={() => navigate("/communities")}
                            className="h-11 sm:h-12 border-none text-blue-700 hover:text-blue-800 text-md sm:text-lg px-6 sm:px-8"
                        >
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            
                             { " { Explore the communities } "}
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* FIXED PROMPT INPUT SECTION */}
            <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                selectedSector={selectedSector}
                setSelectedSector={setSelectedSector}
                sectors={sectors}
                handleRate={handleRate}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default Playground;