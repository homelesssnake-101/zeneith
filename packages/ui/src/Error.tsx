import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function Error({ person, setStatus, error }: { person: any; setStatus: (status: 'success' | 'idle' | 'error') => void; error: string; }) {
    
    // Fallback person data in case none is provided.
    const recipient = person || {
        id: "fallback-user-01",
        name: "Elena Rodriguez",
        imageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    };

    return (
        <motion.div
            layoutId={recipient.id + "person"}
            className="absolute inset-0 z-100 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Main content card with its own animation */}
            <motion.div
                className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col items-center text-center relative"
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0, transition: { delay: 0.1, type: "spring", stiffness: 200, damping: 20 } }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
            >
                {/* Close button to return to the previous screen */}
                <button 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={() => setStatus('idle')}
                >
                    <X size={24} />
                </button>

                {/* Animated Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.2, type: 'spring', stiffness: 300, damping: 15 } }}
                >
                    <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
                </motion.div>

                {/* Error Message */}
                <motion.h2 
                    className="text-3xl font-bold text-gray-900"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                >
                    Payment Failed
                </motion.h2>
                
                <motion.p 
                    className="text-gray-600 mt-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                >
                    {error || "An unknown error occurred. Please try again."}
                </motion.p>

                {/* Divider */}
                <motion.div 
                    className="w-1/3 h-px bg-gray-200 my-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.5 } }}
                />

                {/* Recipient Info */}
                <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
                >
                    <img src={recipient.imageUrl} alt={recipient.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white" />
                    <div>
                        <p className="font-semibold text-gray-800 text-left">{recipient.name}</p>
                        <p className="text-xs text-gray-500 text-left">Transaction Failed</p>
                    </div>
                </motion.div>
                
                {/* Try Again Button */}
                <motion.button
                    onClick={() => setStatus('idle')}
                    className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-full mt-10 shadow-lg shadow-red-500/30 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
                >
                    Try Again
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
