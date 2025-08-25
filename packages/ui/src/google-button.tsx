"use client";

import React from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";


interface GoogleButtonProps {
  text: string;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ text }) => {
    

  
  return (
  <motion.button 
    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-background to-secondary/50 border-2 border-border hover:border-primary/30 text-foreground font-semibold py-4 px-6 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-soft hover:shadow-primary/20 group relative overflow-hidden"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    onClick={ () => {
      signIn('google', {callbackUrl:"/mainapp/user"});
  


    }}
  >
    <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity duration-300" />
    
    <motion.svg 
      className="w-6 h-6 relative z-10" 
      viewBox="0 0 48 48"
      whileHover={{ rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.184 29.658 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.841-5.841C34.553 6.184 29.658 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.846 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </motion.svg>
    <span className="relative z-10">{text}</span>
  </motion.button>
)}
