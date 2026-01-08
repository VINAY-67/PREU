import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { isAuthenticated } from "../core/auth";

// Neumorphic Constants refined for Dark/Black context
const NEUMO_MENU_ITEM = "bg-[#0a0a0a] shadow-[5px_5px_10px_#050505,-5px_-5px_10px_#0f0f0f]";
const PRIMARY_ACCENT = "bg-indigo-600";

const Layout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = isAuthenticated() || {};
    const user = auth.user || {};

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/");
        setIsOpen(false);
    };

    const navItems = [
        { name: "Playground", path: "/playground" },
        { name: "Communities", path: "/communities" },
        { name: "Profile", path: `/profile/${user?._id}` },
    ];

    return (
        <div className="min-h-screen bg-blue-50 font-sans flex flex-col">
            <header className={`fixed left-0 w-full z-[100] transition-all duration-500 
                ${isOpen ? "bg-transparent" : "bg-neutral-100/80 backdrop-blur-md"} 
                ${isOpen ? "top-0" : "bottom-0 md:top-0 md:bottom-auto"} 
                flex justify-between items-center px-6 py-2 md:px-12`}
            >
                {/* Logo Section */}
                <div 
                    className={`cursor-pointer transition-all duration-500 transform ${isOpen ? "invert brightness-100 scale-110" : "hover:scale-105"}`} 
                    onClick={() => navigate("/")}
                >
                    <img src="../Preu.png" alt="Logo" className="h-[30px] md:h-[35px]" />
                </div>

                {/* Neumorphic Toggle Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`z-[110] p-2 rounded-2xl md:rounded-full transition-all duration-500 flex items-center gap-2 ${
                        isOpen 
                        ? "text-white bg-neutral-900 shadow-[inset_3px_3px_6px_#000,inset_-3px_-3px_6px_#1a1a1a]" 
                        : "text-black bg-neutral-100 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff]"
                    }`}
                >
                    <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em]">
                        {isOpen ? "Close" : "Menu"}
                    </span>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* FULL SCREEN OPAQUE OVERLAY (The Agency Soul) */}
            <div 
                className={`fixed inset-0 z-[90] bg-[#0a0a0a] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
                    isOpen ? "translate-y-0 opacity-100" : "translate-y-full md:-translate-y-full opacity-0"
                }`}
            >
                <nav className="h-full flex flex-col justify-center overflow-hidden">
                    {navItems.map((item, index) => (
                        <div 
                            key={item.name}
                            className={`group relative border-b border-white/5 transition-all duration-700 ${
                                isOpen ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                            }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <button
                                onClick={() => navigate(item.path)}
                                className="w-full py-8 md:py-12 px-8 md:px-20 flex items-center justify-between text-left group"
                            >
                                <span className="text-white/40 group-hover:text-white text-4xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter transition-all duration-500 group-hover:pl-4">
                                    {item.name}
                                </span>
                                
                                {/* Neumorphic Icon Indicator */}
                                <div className={`hidden md:flex w-16 h-16 rounded-full items-center justify-center text-white/20 group-hover:text-indigo-500 transition-all duration-500 ${NEUMO_MENU_ITEM}`}>
                                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                </div>

                                {/* Sliding Highlight Underline */}
                                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-transparent overflow-hidden">
                                    <div className={`h-full w-full ${PRIMARY_ACCENT} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out`} />
                                </div>
                            </button>
                        </div>
                    ))}

                    {/* Logout Option */}
                    <div className={`mt-10 px-8 md:px-20 transition-all duration-700 delay-500 ${isOpen ? "opacity-100" : "opacity-0"}`}>
                        <button 
                            onClick={handleLogout}
                            className="text-red-500/50 hover:text-red-500 uppercase tracking-widest text-xs font-bold py-4 px-8 border border-red-500/20 rounded-full hover:border-red-500 transition-all"
                        >
                            [ Logout Session ]
                        </button>
                    </div>
                </nav>

                {/* Minimalist Background Lines */}
                <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-20">
                    <div className="border-r border-white/[0.03] h-full" />
                    <div className="border-r border-white/[0.03] h-full" />
                    <div className="border-r border-white/[0.03] h-full" />
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className={`flex-grow transition-all duration-700 
                ${isOpen ? "blur-xl scale-110 opacity-0" : "blur-0 scale-100 opacity-100"}
                pt-2 pb-2 md:pt-0 md:pb-6`}
            >
                <div className="container mx-auto px-6 ">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;