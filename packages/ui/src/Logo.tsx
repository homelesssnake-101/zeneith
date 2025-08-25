"use client";
import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => (
  <motion.div 
    className={`flex items-center gap-3 ${className}`}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
  >
    <motion.div
      className="relative"
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path 
          d="M6 2L26 2L13 16L26 30H6L19 16L6 2Z" 
          fill="url(#logoGradient)"
          className="drop-shadow-md"
        />
      </svg>
      <div className="absolute inset-0 animate-pulse-soft opacity-50">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <path d="M6 2L26 2L13 16L26 30H6L19 16L6 2Z" fill="currentColor" className="opacity-30" />
        </svg>
      </div>
    </motion.div>
    <motion.span 
      className="text-2xl font-bold tracking-tight bg-gradient-to-r from-current to-current/70 bg-clip-text"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      Zenith Pay
    </motion.span>
  </motion.div>
);