import React, { useState } from "react";
// Using real imports as requested by the user's code structure
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

// --- NEUMORPHISM COLOR PALETTE & CONSTANTS (Warm Neutral / Indigo Theme) ---
// Changed from cool blue to warm neutral for background
const NEUMO_BG = "bg-neutral-100"; 
// Changed from blue-100 to pure white for card/navbar surface
const NEUMO_CARD_BG = "bg-white"; 
// Changed accent color from blue-700 to indigo-600
const PRIMARY_ACCENT_TEXT = "text-indigo-600"; 
// Neumorphic Shadows (Convex/Raised) - adjusted shadow color and intensity for a neutral background
const PRIMARY_SHADOW = "shadow-[8px_8px_16px_rgba(180,180,180,0.3),-8px_-8px_16px_rgba(255,255,255,1)]";
// Neumorphic Shadows (Concave/Pressed - used for active/toggled state)
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(180,180,180,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";

// Neumorphic Nav Button Component (This handles the desktop links)
const NavButton = ({ children, className = "", ...props }) => {
    // 1. Setup hover/active states (colors)
    const baseStyles = `text-gray-600 hover:${PRIMARY_ACCENT_TEXT} transition-all duration-200 font-medium`;
    
    // 2. Add Lift/Scale and Relative positioning for the underline
    // 'group' is necessary to target the underline span inside
    const interactiveContainerStyles = `relative group transform hover:scale-[1.03] transition-transform duration-200 rounded-lg p-1`; 
    
    // 3. Active/Pressed state for color
    const interactiveStyles = "active:shadow-none active:text-indigo-800 transition-all duration-150";

    return (
        <button 
            className={`${interactiveContainerStyles} ${baseStyles} ${interactiveStyles} ${className}`} 
            {...props}
        >
            {children}
            {/* Animated Underline: 
                - Centered using left-1/2 and -translate-x-1/2
                - Initially scaled to 0 width (scale-x-0)
                - Scales to 100% width on group-hover 
            */}
            <span className={`absolute bottom-0 left-1/2 w-[80%] h-0.5 bg-indigo-600 transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full`}></span>
        </button>
    );
};

const Layout = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Uses the actual useNavigate hook
    const navigate = useNavigate();

    const handleLogout = () => {
        // Keeps the original localStorage logic
        localStorage.removeItem("authToken");
        navigate("/");
    };

    const navItems = [
        { name: "Playground", path: "/playground" },
        { name: "Communities", path: "/communities" },
        { name: "Profile", path: "/profile" },
    ];

    return (
        // Main background uses NEUMO_BG
        <div className={`min-h-screen ${NEUMO_BG} font-sans`}>
            
            {/* Navigation Bar: Uses NEUMO_CARD_BG and PRIMARY_SHADOW (Raised) */}
            <nav className={`${NEUMO_CARD_BG} ${PRIMARY_SHADOW} sticky top-0 z-40 transition-shadow duration-300 rounded-b-3xl`}>
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        {/* Styled Neumorphic Logo Placeholder - background changed to indigo-400 */}
                        {/* <div className="w-8 h-8 rounded-lg bg-indigo-400 flex items-center justify-center font-bold text-white shadow-md">P</div>
                         */}
                         <img src="./Preu.png" alt=""  className="h-[35px]"/>
                        {/* <span className={`font-extrabold text-xl ${PRIMARY_ACCENT_TEXT}`}>PREU</span> */}
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map(item => (
                            <NavButton key={item.name} onClick={() => navigate(item.path)}>
                                {item.name}
                            </NavButton>
                        ))}
                        <NavButton 
                            onClick={handleLogout} 
                            // The Logout button needs a slightly different underline color to match its text
                            className="!text-red-500 hover:!text-red-700"
                        >
                            Logout
                            {/* Adding a custom red underline for Logout button */}
                            <span className="absolute bottom-0 left-1/2 w-[80%] h-0.5 bg-red-600 transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                        </NavButton>
                    </div>

                    {/* Mobile Menu Toggle Button: Applies Neumorphic button style */}
                    <button 
                        // ADDED: hover:scale-110 for animation
                        className={`md:hidden p-2 rounded-full ${NEUMO_BG} ${PRIMARY_SHADOW} transition-all duration-300 active:${PRESSED_SHADOW} text-gray-600 hover:text-indigo-600 hover:scale-110`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {/* Uses the actual Lucide icons */}
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu: Uses NEUMO_CARD_BG and border */}
                {isOpen && (
                    <div className={`md:hidden ${NEUMO_CARD_BG} py-2 border-t border-neutral-200 transition-all duration-300`}>
                        {navItems.map(item => (
                            <button 
                                key={item.name}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsOpen(false);
                                }} 
                                // ADDED: hover:scale-[1.01] and transform origin
                                className={`block w-full text-left px-6 py-3 text-gray-600 hover:bg-neutral-100 transition-all duration-150 rounded-lg active:bg-neutral-200 active:${PRESSED_SHADOW} hover:scale-[1.01] transform origin-top-left`}
                            >
                                {item.name}
                            </button>
                        ))}
                        <button 
                            onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                            }} 
                            // ADDED: hover:scale-[1.01] and transform origin
                            className={`block w-full text-left px-6 py-3 text-red-500 hover:bg-neutral-100 transition-all duration-150 rounded-lg border-t mt-1 border-neutral-200 active:bg-neutral-200 active:${PRESSED_SHADOW} hover:scale-[1.01] transform origin-top-left`}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>

            {/* Content Renders Here - Uses the actual Outlet */}
            <Outlet />
        </div>
    );
};

export default Layout;
