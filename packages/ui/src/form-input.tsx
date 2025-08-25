"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  icon: LucideIcon;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  inputMode?: "numeric" | "text"|"tel";
}

export const FormInput: React.FC<FormInputProps> = ({ 
  id, 
  label, 
  type = "text", 
  icon: Icon, 
  value, 
  onChange, 
  disabled = false,
  className ,
  min,
  max,
  inputMode
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <motion.div 
      className="relative w-full group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className={` absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-300 z-10`}>
        <Icon size={20} className={isFocused ? "text-primary" : ""} />
      </div>
      
      <input
        id={id}
        type={isPassword ? (isPasswordVisible ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        className={` ${className} w-full bg-gradient-to-r from-background to-secondary/20 border-2 border-border hover:border-primary/50 focus:border-primary focus:bg-background rounded-2xl py-4 pl-12 pr-12 outline-none transition-all duration-300 peer backdrop-blur-sm shadow-soft hover:shadow-primary/20 focus:shadow-primary`}
        disabled={disabled}
        min={min}
        max={max}
        inputMode={inputMode??"text"}
          />
      
      <motion.label
        htmlFor={id}
        className={`absolute left-12 transition-all duration-300 pointer-events-none
          ${value || isFocused 
            ? 'top-2 text-xs text-primary font-medium' 
            : 'top-1/2 -translate-y-1/2 text-muted-foreground'
          }`}
        animate={{
          scale: value || isFocused ? 0.85 : 1,
          y: value || isFocused ? -8 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {label}
      </motion.label>
      
      {isPassword && (
        <motion.button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </motion.button>
      )}
      
      <div className={`absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 blur-sm transition-opacity duration-300 -z-10 ${isFocused ? 'opacity-20' : ''}`} />
    </motion.div>
  );
};
