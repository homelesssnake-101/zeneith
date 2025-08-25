"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { LogIn, LogOut } from 'lucide-react';
import { Logo } from "./Logo";



// AppbarProps remains the same
interface AppbarProps {
    user?: {
        id: number;
        name?: string | null;
    },
    onSignin: () => void,
    onSignout: () => void,
    open: boolean
}

// The updated Appbar component
export const Appbar = ({
    user,
    onSignin,
    onSignout,
    open
}: AppbarProps) => {

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="w-full ">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Branding Section - REPLACED WITH YOUR LOGO */}
                    <div className="flex items-center justify-center ml-13 max-sm:ml-12 ">
                        <Logo className="text-blue-500 max-sm:w-4 max-sm:h-4 " />
        
                    </div>

                    {/* User Actions Section (Unchanged) */}
                    <div className="flex items-center space-x-4">
                        {user && (
                            <motion.div 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center space-x-3"
                            >
                                <div className="hidden sm:block font-medium text-gray-600 text-right">
                                    <div className="text-sm">{user.name}</div>
                                </div>
                                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                                    <button onClick={() => {window.location.href = "/mainapp/user"}} className="font-semibold text-gray-600">{userInitial}</button>
                                </div>
                            </motion.div>
                        )}
                        <button 
                            onClick={user ? onSignout : onSignin} 
                            className="flex items-center space-x-2 !px-4 !py-2"
                        >
                            {user ? <LogOut size={16} /> : <LogIn size={16} />}
                            <span>{user ? "Logout" : "Login"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};