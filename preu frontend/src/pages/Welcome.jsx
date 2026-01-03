import { useNavigate } from "react-router-dom";
import { Sparkles, Users, TrendingUp, Shield, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
const NEUMO_BG = "bg-blue-50";
const PRIMARY_ACCENT_TEXT = "text-blue-700";
const PRIMARY_ACCENT_BG = "bg-blue-500";
const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(174,174,192,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";
const GRADIENT_COLORS = "conic-gradient(from 180deg at 50% 50%, #FF00FF 0deg, #00FFFF 90deg, #FFFF00 180deg, #FF00FF 360deg)";

// --- 1. NavBarLink Component ---
const NavBarLink = ({ children, href }) => {
   return (
      <motion.a
         href={href}
         className="group relative text-gray-700 hover:text-blue-700 transition-colors duration-200"
         whileHover={{ y: -2 }}
         transition={{ duration: 0.2 }}
      >
         {children}
         <motion.span
            className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
         />
      </motion.a>
   );
};

// --- 2. FeatureCard Component with Scroll-Triggered Animation ---
const FeatureCard = ({ icon: IconComponent, title, description, index }) => {
   const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.2,
   });

   return (
      <motion.div
         ref={ref}
         initial={{ opacity: 0, y: 50 }}
         animate={inView ? { opacity: 1, y: 0 } : {}}
         transition={{ duration: 0.5, delay: index * 0.2, ease: "easeOut" }}
         whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
         className={`relative isolate overflow-hidden p-6 md:p-10 rounded-2xl md:rounded-3xl ${NEUMO_BG} ${PRIMARY_SHADOW}`}
         style={{ willChange: "transform, opacity" }}
      >
         <motion.div
            className="absolute inset-[-1000%] z-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ background: GRADIENT_COLORS }}
         />
         <div className={`absolute inset-[3px] rounded-[19px] md:rounded-[27px] ${NEUMO_BG} z-10`} />
         <motion.div
            className="relative z-20"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
         >
            <motion.div
               className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 md:mb-6 ${PRESSED_SHADOW}`}
               animate={{ scale: [1, 1.08, 1] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
            >
               <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${PRIMARY_ACCENT_TEXT}`} />
            </motion.div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{description}</p>
         </motion.div>
      </motion.div>
   );
};

// --- 3. Button Component  ---
const Button = ({ children, className = "", variant = "default", size = "lg", ...props }) => {
   const sizes = {
      lg: "px-6 py-3 text-base font-semibold md:px-8 md:py-4 md:text-lg",
      md: "px-4 py-2 text-sm md:px-6 md:py-3 md:text-base font-medium",
   };

   const accentGlowEffect = variant === "accent" ? {
      whileHover: {
         scale: 1.02,
         boxShadow: "0 0 25px rgba(59, 130, 246, 0.7)",
      },
      animate: {
         boxShadow: [
            "0 0 15px rgba(59, 130, 246, 0.4)",
            "0 0 15px rgba(236, 72, 153, 0.4)",
            "0 0 15px rgba(59, 130, 246, 0.4)",
         ],
      },
      transition: {
         boxShadow: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
         },
      },
   } : {
      whileHover: { scale: 1.01 },
      transition: { duration: 0.2 },
   };

   const baseClasses = {
      default: `${NEUMO_BG} text-gray-900 ${PRIMARY_SHADOW} active:${PRESSED_SHADOW}`,
      accent: `${PRIMARY_ACCENT_BG} text-white shadow-lg shadow-blue-500/50 hover:bg-blue-400 active:bg-blue-600 relative overflow-hidden`,
      outline: `bg-transparent text-gray-700 ${PRESSED_SHADOW} hover:bg-blue-100/50`,
   };

   return (
      <motion.button
         whileTap={{ scale: 0.98 }}
         className={`rounded-full transition-all duration-300 transform ${baseClasses[variant]} ${sizes[size]} ${className}`}
         style={{ willChange: "transform, box-shadow" }}
         {...accentGlowEffect}
         {...props}
      >
         <span className="relative z-10 flex items-center justify-center gap-2">
            {children}
         </span>
      </motion.button>
   );
};

// --- Main Welcome Component ---
const Welcome = () => {
   const navigate = useNavigate();
   const { ref: featuresRef, inView: featuresInView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
   });

   const features = [
      { icon: Sparkles, title: "AI-Powered Ratings", description: "Get instant, intelligent ratings on your prompts using advanced AI models." },
      { icon: Users, title: "Community Driven", description: "Join vibrant communities, share prompts, and learn from top prompt engineers." },
      { icon: TrendingUp, title: "Build Your Reputation", description: "Earn popularity scores as your prompts get rated and utilized globally." },
      { icon: Shield, title: "Curated Content", description: "Explore a marketplace of high-quality, verified prompts across multiple sectors." },
   ];

   useEffect(() => {
      const handleScroll = () => {
         const hero = document.querySelector(".hero-section");
         if (hero) {
            const scrollY = window.scrollY;
            hero.style.backgroundPositionY = `${scrollY * 0.2}px`;
         }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div className={`min-h-screen ${NEUMO_BG} text-gray-900 font-sans antialiased`}>
         <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`${NEUMO_BG}/95 backdrop-blur-sm shadow-[0_4px_8px_-2px_rgba(0,0,0,0.05)] sticky top-0 z-40`}
         >
            <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
               <motion.div
                  className="flex items-center gap-2 md:gap-3"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
               >
                  <img src="./Preu.png" alt="" className="h-8" />
               </motion.div>
               <nav className="hidden md:flex space-x-8 text-base font-medium">
                  {["Features", "About", "Author"].map((item, index) => (
                     <NavBarLink key={index} href={`#${item.toLowerCase()}`}>
                        {item}
                     </NavBarLink>
                  ))}
               </nav>
               <Button
                  onClick={() => navigate("/auth")}
                  variant="default"
                  size="md"
                  className="text-gray-700 rounded-lg hover:text-blue-700 cursor-pointer"
               >
                  Sign In
               </Button>
            </div>
         </motion.header>

         <section
            className="hero-section container mx-auto px-6 py-20 md:py-20 min-w-full"
            style={{
               backgroundImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1)) ",
               backgroundAttachment: "fixed",
            }}
         >
            <motion.div
               className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.8 }}
            >
               <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="inline-block"
               >
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 text-sm font-semibold ${PRESSED_SHADOW}`}>
                     <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${PRIMARY_ACCENT_TEXT}`} />
                     <span className="tracking-wider">Rate • Explore • Use</span>
                  </div>
               </motion.div>
               <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight"
               >
                  Discover & Rate the{" "}
                  <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                     Best AI Prompts
                  </span>
               </motion.h1>
               <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center pt-4 md:pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
               >
                  <div className="relative">
                     <motion.span
                        className="absolute inline-flex h-full rounded-full bg-blue-400 opacity-50"
                     />
                     <Button
                        size="lg"
                        onClick={() => navigate("/auth")}
                        variant="accent"
                        className="relative w-[100%]"
                     >
                        Get Started
                     </Button>
                  </div>
                  <Button
                     size="lg"
                     variant="default"
                     onClick={() => navigate("/auth")}
                     className={`text-gray-700 hover:${PRIMARY_ACCENT_TEXT}`}
                  >
                     Explore Prompts
                     <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                     >
                        <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 ${PRIMARY_ACCENT_TEXT}`} />
                     </motion.div>
                  </Button>
               </motion.div>
            </motion.div>
         </section>

         <hr className="container mx-auto border-blue-200 max-w-lg md:max-w-3xl" />

         <section ref={featuresRef} className="container mx-auto px-6 py-20 md:py-32" id="features">
            <motion.h2
               initial={{ opacity: 0, y: 30 }}
               animate={featuresInView ? { opacity: 1, y: 0 } : {}}
               transition={{ duration: 0.6 }}
               className="text-3xl md:text-4xl font-extrabold text-center mb-10 md:mb-16 text-gray-800"
            >
               Core Features
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto">
               {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} index={index} />
               ))}
            </div>
         </section>

         <section className="container mx-auto px-6 mt-12 mb-20 md:mt-16 md:mb-40">
            <motion.div
               className={`max-w-5xl mx-auto text-center p-10 md:p-20 rounded-[30px] md:rounded-[40px] ${NEUMO_BG} ${PRIMARY_SHADOW}`}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, amount: 0.3 }}
               transition={{ duration: 0.7, ease: "easeOut" }}
            >
               <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 text-gray-900"
               >
                  Ready to Level Up Your Prompts?
               </motion.h2>
               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12"
               >
                  Join thousands of users who are mastering AI prompts with PREU today.
               </motion.p>
               <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  variant="accent"
                  className="cursor-pointer"
               >
                  Start Rating & Exploring
               </Button>
            </motion.div>
         </section>

         <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`border-t border-blue-200 ${NEUMO_BG}`}
         >
            <div className="container mx-auto px-6 py-6 md:py-8 text-center text-sm text-gray-500">
               <p>&copy; 2025 PREU. All rights reserved.</p>
               <p>Built with React, Tailwind CSS, and Framer Motion.</p>
            </div>
         </motion.footer>
      </div>
   );
};

export default Welcome;
