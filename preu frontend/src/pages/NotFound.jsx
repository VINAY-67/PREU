import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ZapOffIcon } from "lucide-react"
import {Link} from "react-router-dom"
// --- NEUMORPHISM COLOR PALETTE & CONSTANTS (Pale Sky Blue Theme) ---
const NEUMO_BG = "bg-blue-50";
const NEUMO_CARD_BG = "bg-blue-100";
const PRIMARY_ACCENT_TEXT = "text-blue-700";
const CTA_GRADIENT = "bg-gradient-to-r from-cyan-500 to-blue-600";
const CTA_SHADOW = "shadow-xl shadow-cyan-500/30";
const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(174,174,192,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";

// --- MOCKED ROUTING AND ICONS ---
const useLocationMock = () => ({
  pathname: "/app/secret-route-123",
  state: null,
  search: ""
});

const LinkMock = ({ to, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    console.log(`Simulating navigation to: ${to}`);
    alert(`Simulating navigation to: ${to}`);
  };

  const isButton = children?.type === 'button';
  return isButton ? (
    React.cloneElement(children, { onClick: handleClick })
  ) : (
    <div className="cursor-pointer" onClick={handleClick}>
      {children}
    </div>
  );
};

// --- Custom SVG Illustration (Friendly AI Bot with 404 Sign) ---
const Bot404Icon = ({ className = 'w-32 h-32' }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    className={className}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {/* Bot Head */}
    <circle cx="100" cy="70" r="40" fill="#93c5fd" stroke="#3b82f6" strokeWidth="4" />
    {/* Antenna */}
    <motion.line
      x1="100" y1="30" x2="100" y2="10"
      stroke="#3b82f6" strokeWidth="4"
      animate={{ y2: [10, 5, 10] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <circle cx="100" cy="10" r="5" fill="#3b82f6" />
    {/* Eyes */}
    <circle cx="85" cy="65" r="5" fill="#1e3a8a" />
    <circle cx="115" cy="65" r="5" fill="#1e3a8a" />
    {/* Body */}
    <rect x="80" y="110" width="40" height="60" rx="10" fill="#93c5fd" stroke="#3b82f6" strokeWidth="4" />
    {/* 404 Sign */}
    <motion.rect
      x="60" y="120" width="80" height="30" rx="5"
      fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <text x="100" y="140" fontSize="20" fill="#1e3a8a" textAnchor="middle" fontWeight="bold">404</text>
  </motion.svg>
);

// --- Card Component ---
const Card = ({ children, className = "", ...props }) => (
  <motion.div
    className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} transition-all duration-300 ${className}`}
    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
    transition={{ duration: 0.3 }}
    style={{ willChange: "transform, box-shadow" }}
    {...props}
  >
    {children}
  </motion.div>
);

// --- Button Component ---
// --- Button Component (Neumorphic Style, now with Subtle Pulse) ---
const Button = ({ children, className = "", variant = "default", size = "md", ...props }) => {
  const baseStyles = "font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center relative overflow-hidden";

  // Adjusted variants: The 'default' (CTA) is the only one getting the new pulse effect.
  const variants = {
    // Primary gradient CTA: Now subtly animated via the motion props
    default: `${CTA_GRADIENT} text-white ${CTA_SHADOW} hover:brightness-110 active:shadow-none`,
    // Neumorphic Outline (Raised look)
    neumo: `${NEUMO_CARD_BG} text-gray-700 ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW} active:shadow-none`,
    // Subtle Neumorphic for the icon button (Edit2/Contact Icons)
    icon: `${NEUMO_CARD_BG} text-gray-500 ${PRIMARY_SHADOW} p-3 hover:scale-[1.05] active:${PRESSED_SHADOW} active:shadow-none`,
    // Small icon used for contact links 
    contactIcon: `${NEUMO_CARD_BG} text-gray-500 ${PRIMARY_SHADOW} p-2 hover:scale-[1.1] active:${PRESSED_SHADOW} active:shadow-none rounded-full`,
  };

  const sizes = {
    sm: "px-3 py-1 text-sm h-9",
    md: "px-6 py-3 h-12",
    lg: "px-8 py-4 text-lg h-14",
    icon: "p-3",
  };

  const variantStyles = variants[variant] || variants.default;
  const isDefault = variant === 'default';

  return (
    <motion.button
      // Framer Motion interaction effects
      whileHover={isDefault ? { scale: 1.01, boxShadow: "0 0 25px rgba(59, 130, 246, 0.7)" } : { scale: 1.01 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      className={`${baseStyles} ${variantStyles} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* NEW: Subtle Pulse Shadow for the primary CTA only */}
      {isDefault && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ boxShadow: ["0 0 10px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.7)", "0 0 10px rgba(59, 130, 246, 0.5)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// --- Main 404 Content Component (Only the necessary part updated) ---
const NotFoundContent = () => {
  // ... (rest of the component state/hooks remain the same) ...
  const location = useLocationMock();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className={`flex min-h-screen items-center justify-center ${NEUMO_BG} p-6 font-sans relative overflow-hidden`}>
      {/* Subtle Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-cyan-100/20"
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Card className="text-center max-w-lg w-full space-y-8 p-10 relative z-10" ref={ref}>
        {/* Animated Bot Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <Bot404Icon className="w-32 h-32" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-7xl font-extrabold text-blue-600 tracking-wider flex items-center justify-center"
        >
          404
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="ml-2"
          >
            <ZapOffIcon className="inline-block w-8 h-8" />
          </motion.div>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl font-semibold text-gray-700"
        >
          Oops! This Prompt Got Lost in the AI Galaxy
        </motion.p>

        

        {/* Primary Action Button (The updated Button component is used here) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='relative left-15 '
        >
          <Link  to="/">
            <Button size="md" className='relative md:left-20' > 
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Secondary Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/">
            <p className="text-sm text-gray-500 hover:text-blue-600 transition-colors mt-6 cursor-pointer">
              Or  Wait Some Time
            </p>
          </Link>
        </motion.div>
      </Card>

      {/* Custom CSS (No longer needed) */}
      <style>{`
    @keyframes pulse-slow {
     0%, 100% { opacity: 1; }
     50% { opacity: 0.6; }
    }
    .animate-pulse-slow {
     animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
   `}</style>
    </div>
  );
};

// --- Main App Component ---
const App = () => <NotFoundContent />;

export default App;
