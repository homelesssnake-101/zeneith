"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {Suspense} from 'react';

// This is the same Logo component from your AuthPage.
// You would typically import this from a shared components directory.
const Logo = ({ className } : {className: string}) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L26 2L13 16L26 30H6L19 16L6 2Z" fill="currentColor"/>
        </svg>
        <span className="text-2xl font-bold tracking-tight">Zenith Pay</span>
    </div>
);

export default function ErrorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthErrorPage />
        </Suspense>
    );
}

// The main error page component.
export function AuthErrorPage() {
    

    const searchParams = useSearchParams();
    const errorType = searchParams.get("error")||"default";
    const errorMessages: Record<string, {title:string,message:string}> = {
        CredentialsSignin: {title:"Invalid Credentials",message:"The credentials you provided are incorrect. Please check your details and try again."},
        OAuthSignin: {title:"Error in constructing an authorization URL.",message:"Error in constructing an authorization URL."},
        OAuthCallback: {title:"Error handling the OAuth callback.",message:"Error handling the OAuth callback."},
        OAuthCreateAccount: {title:"Could not create OAuth account.",message:"Could not create OAuth account."},
        EmailCreateAccount: {title:"Could not create email account.",message:"Could not create email account."},
        Callback: {title:"Error in the callback handler.",message:"Error in the callback handler."},
        OAuthAccountNotLinked: {title:"Please sign in with the same provider you used before.",message:"Please sign in with the same provider you used before."},
        EmailSignin: {title:"Check your email inbox for the sign-in link.",message:"Check your email inbox for the sign-in link."},
        default: {title:"Something went wrong. Please try again.",message:"Something went wrong. Please try again."},
      };
    const { title , message } = errorMessages[errorType as keyof typeof errorMessages] || errorMessages.default!;

    return (
        <div className="min-h-screen bg-white lg:flex lg:items-center lg:justify-center font-sans">
            <div className="min-h-screen lg:min-h-0 grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full bg-white lg:rounded-3xl lg:shadow-2xl overflow-hidden">
                {/* Left Side: Error Message and Action */}
                <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
                        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            {title}
                        </h1>
                        <p className="mt-4 text-base text-gray-500 max-w-sm mx-auto">
                            {message}
                        </p>
                        <a
                            href="/auth/signin" // Link back to your sign-in page
                            className="mt-8 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-500/30 transform hover:scale-105 hover:bg-red-700 transition-all duration-300"
                        >
                            <ArrowLeft size={20} />
                            Return to Sign In
                        </a>
                    </motion.div>
                </div>

                {/* Right Side: Decorative Panel */}
                <div className="hidden lg:block bg-gray-100 p-12 relative">
                     <div className="relative z-10 flex flex-col justify-center h-full text-center">
                        <Logo className="text-gray-800 mx-auto mb-8" />
                        <h2 className="text-3xl font-bold text-gray-800">
                            Security is Our Priority
                        </h2>
                        <p className="mt-4 text-gray-600 max-w-md mx-auto">
                            Your account is protected with industry-leading security measures. If you're having trouble signing in, please ensure your details are correct or contact support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}