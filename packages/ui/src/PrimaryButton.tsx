"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  showArrow?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  showArrow = true 
}) => (
  <motion.button 
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-3 bg-gradient-primary text-primary-foreground font-bold py-4 px-8 rounded-2xl shadow-primary hover:shadow-glow transition-all duration-300 group relative overflow-hidden ${className}`}
    whileHover={{ 
      scale: 1.02, 
      y: -2,
      boxShadow: "var(--shadow-glow)"
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    {/* Animated background */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer bg-[length:200%_100%]" />
    
    <span className="relative z-10">{children}</span>
    
    {showArrow && (
      <motion.div
        className="relative z-10"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight size={20} />
      </motion.div>
    )}
    
    {/* Glow effect */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10" />
  </motion.button>
)