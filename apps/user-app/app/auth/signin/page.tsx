"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, Phone, Image as ImageIcon } from "lucide-react";
import { FormInput } from "@repo/ui/form-input";
import { GoogleButton } from "@repo/ui/google-button";
import { Logo } from "@repo/ui/Logo";
import { PrimaryButton } from "@repo/ui/PrimaryButton";
import { signIn } from "next-auth/react";
import { useRouter,useSearchParams } from "next/navigation";
import {Suspense} from 'react';
export default function Authwithsuspense() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthPage />
        </Suspense>
    );
}

export  function AuthPage() {
  const [loading,setLoading] = useState<boolean>(false);


  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
  
    const error = searchParams.get("error");
    if(error){
      router.push(`/auth/error?error=${error}`);
      
    }
    setLoading(false);
    
  },[])


  

    const testimonials = [
        {
          quote: "This app has revolutionized how I handle my finances. It's intuitive, fast, and incredibly secure. Highly recommended!",
          author: {
            name: "Elena Rodriguez",
            title: "Freelance Designer",
            image: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
          }
        },
        {
          quote: "The best payment application I've ever used. The user interface is clean, and the multi-step setup process made me feel secure.",
          author: {
            name: "Marcus Chen",
            title: "Tech Entrepreneur", 
            image: "https://i.pravatar.cc/150?u=a042581f4e29026705d"
          }
        },
        {
          quote: "Switching to this platform was a game-changer for my small business. Transactions are seamless and the support is top-notch.",
          author: {
            name: "Aisha Khan",
            title: "Cafe Owner",
            image: "https://i.pravatar.cc/150?u=a042581f4e29026706d"
          }
        }
      ];

        const [authMode, setAuthMode] = useState<'signUp' | 'signIn'>('signIn');
        const [setupStep, setSetupStep] = useState(0);
        const [formData, setFormData] = useState({
          phone: "",
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          image: null as File | null,
        });
        const numberexp= /^\d{10,}$/;
        
        const [quoteIndex, setQuoteIndex] = useState(0);
        const currentTestimonial = useMemo(() => {
          return (testimonials[quoteIndex] ?? testimonials[0]!);
        }, [quoteIndex]);
      
        // Auto-cycle testimonials
        useEffect(() => {
          const interval = setInterval(() => {
            setQuoteIndex(prevIndex => (prevIndex + 1) % testimonials.length);
          }, 7000);
          return () => clearInterval(interval);
        }, []);
      
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { id, value } = e.target;
          setFormData(prev => ({ ...prev, [id]: value }));
        };
      
        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file: File | null = e.target.files?.[0] ?? null;
          setFormData(prev => ({ ...prev, image: file }));
        };
      
        // Create a memoized preview URL for the selected image and clean it up
        const imagePreviewUrl = useMemo(() => {
          if (formData.image) {
            return URL.createObjectURL(formData.image);
          }
          return null;
        }, [formData.image]);

        useEffect(() => {
          return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
          };
        }, [imagePreviewUrl]);

 
      
        const renderAuthForms = () => (
          <motion.div 
            key="auth" 
            initial={{ x: 300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -300, opacity: 0 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                {authMode === 'signUp' ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {authMode === 'signUp' ? "Start your journey with us." : "Sign in to continue."}
              </p>
            </motion.div>
            
            <motion.div 
              className="space-y-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FormInput 
                id="phone" 
                label="Phone Number"
                type="tel"
                inputMode="numeric"

             icon={Phone} 
                value={formData.phone} 
                onChange={handleInputChange} 
          
                className= {` ${numberexp.test(formData.phone) ? " border-green-500" :"border-red-500"}`}
              
              />
              <FormInput 
                id="password" 
                label="Password" 
                type="password"
                icon={Lock} 
                value={formData.password} 
                onChange={handleInputChange} 
              />
            </motion.div>
      
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <PrimaryButton onClick={ () => {
                if (authMode === 'signUp') {
                  setSetupStep(1);
                } else {
                  signIn('credentials', {callbackUrl:"/mainapp/user", phone: String(formData.phone), password: String(formData.password) });

              }}}>
                {authMode === 'signUp' ? "Create Account" : "Sign In"}
              </PrimaryButton>
            </motion.div>
      
            {authMode==="signIn" && (
                <>    <motion.div 
              className="flex items-center my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <hr className="flex-grow border-t border-border" />

  
                              <span className="mx-4 text-muted-foreground text-sm font-medium">OR</span>
                              <hr className="flex-grow border-t border-border" />
                            </motion.div>
                      
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <GoogleButton text={ "Sign in with Google"} />
                            </motion.div>
                </> 
              )}

      
            <motion.p 
              className="text-center text-sm text-muted-foreground mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {authMode === 'signUp' ? "Already have an account?" : "Don't have an account?"}
              <motion.button 
                type="button"
                onClick={() => setAuthMode(authMode === 'signUp' ? 'signIn' : 'signUp')} 
                className="font-semibold text-primary hover:text-primary/80 ml-1 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {authMode === 'signUp' ? "Sign In" : "Sign Up"}
              </motion.button>
            </motion.p>
          </motion.div>
        );
      
        const renderSetupStep1 = () => (
          <motion.div 
            key="step1" 
            initial={{ x: 300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -300, opacity: 0 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            <motion.button 
              type="button"
              onClick={() => setSetupStep(0)} 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-200"
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft size={16} /> Back
            </motion.button>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-2">Personal Details</h2>
              <p className="text-muted-foreground mb-8">Let's get to know you better.</p>
            </motion.div>
            
            <motion.div 
              className="space-y-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FormInput 
                id="name" 
                label="Full Name" 
                type="text" 
                icon={User} 
                value={formData.name} 
                onChange={handleInputChange} 
              />
              <FormInput 
                id="email" 
                label="Email Address" 
                type="email" 
                icon={Mail} 
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </motion.div>
      
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <PrimaryButton onClick={() => setSetupStep(2)}>
                Next
              </PrimaryButton>
            </motion.div>
          </motion.div>
        );
      
        const renderSetupStep2 = () => (
          <motion.div 
            key="step2" 
            initial={{ x: 300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -300, opacity: 0 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            <motion.button 
              type="button"
              onClick={() => setSetupStep(1)} 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-200"
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft size={16} /> Back
            </motion.button>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-2">Final Touches</h2>
              <p className="text-muted-foreground mb-8">Secure your account and add a profile picture.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.label 
                htmlFor="image" 
                className="cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-32 h-32 rounded-full bg-gradient-secondary border-2 border-dashed border-border group-hover:border-primary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
                  {formData.image ? (
                    <motion.img 
                      src={imagePreviewUrl ?? undefined} 
                      alt="Profile Preview" 
                      className="w-full h-full rounded-full object-cover"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  ) : (
                    <motion.div 
                      className="text-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ImageIcon size={32} />
                      <p className="text-xs mt-1 font-medium">Upload Photo</p>
                    </motion.div>
                  )}
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300" />
                </div>
                <input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
              </motion.label>
              
              <div className="w-full space-y-5">
                <FormInput 
                  id="password" 
                  label="Create Password" 
                  type="password" 
                  icon={Lock} 
                  value={formData.password} 
                  onChange={handleInputChange} 
                />
                <FormInput 
                  id="confirmPassword" 
                  label="Confirm Password" 
                  type="password" 
                  icon={Lock} 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                />
              </div>
            </motion.div>
      
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <PrimaryButton onClick={() => console.log('Setup complete!')}>
                Finish Setup
              </PrimaryButton>
            </motion.div>
          </motion.div>
        );
      
        return (
         !loading && <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background lg:flex lg:items-center lg:justify-center font-sans relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary opacity-10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 180],
                  x: [0, -50, 0],
                  y: [0, 50, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent opacity-10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  rotate: [180, 270, 360],
                  x: [0, 50, 0],
                  y: [0, -50, 0]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </div>
      
            <motion.div 
              className="min-h-screen lg:min-h-0 grid grid-cols-1 lg:grid-cols-2 max-w-7xl w-full bg-background/80 backdrop-blur-xl lg:rounded-3xl lg:shadow-2xl overflow-hidden border border-border/50 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Left Panel - Form */}
              <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center relative">
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Logo className="text-foreground" />
                </motion.div>
                
                <AnimatePresence mode="wait">
                  {setupStep === 0 && renderAuthForms()}
                  {setupStep === 1 && renderSetupStep1()}
                  {setupStep === 2 && renderSetupStep2()}
                </AnimatePresence>
              </div>
      
              {/* Right Panel - Testimonials */}
              <div className="hidden lg:block bg-gradient-primary p-12 text-primary-foreground relative overflow-hidden">
                {/* Animated background patterns */}
                <div className="absolute inset-0 opacity-10">
                  <motion.div 
                    className="absolute top-10 right-10 w-20 h-20 border border-current rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute bottom-20 left-10 w-32 h-32 border border-current rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute top-1/2 left-1/2 w-40 h-40 border border-current rounded-full opacity-50"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Logo className="text-primary-foreground mb-12" />
                    <motion.h1 
                      className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <motion.span 
                        className="block"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Seamless Payments,
                      </motion.span>
                      <motion.span 
                        className="block mt-2"
                        animate={{ opacity: [1, 0.8, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                      >
                        Secured for You.
                      </motion.span>
                    </motion.h1>
                    <motion.p 
                      className="mt-6 text-primary-foreground/80 max-w-md text-lg leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      Join thousands of users who trust our platform for fast, reliable, and secure transactions worldwide.
                    </motion.p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-background/20 backdrop-blur-xl p-8 rounded-2xl border border-primary-foreground/20 overflow-hidden h-56 flex items-center shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={quoteIndex}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.9 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full"
                      >
                        <motion.p 
                          className="text-primary-foreground/90 leading-relaxed mb-6 font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          "{currentTestimonial.quote}"
                        </motion.p>
                        <motion.div 
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <motion.img 
                            src={currentTestimonial.author.image} 
                            alt="User testimonial" 
                            className="w-14 h-14 rounded-full object-cover border-2 border-primary-foreground/30 shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <div className="ml-4">
                            <p className="font-bold text-primary-foreground">{currentTestimonial.author.name}</p>
                            <p className="text-sm text-primary-foreground/70">{currentTestimonial.author.title}</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Testimonial indicators */}
                  <motion.div 
                    className="flex justify-center space-x-2 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {testimonials.map((_, index) => (
                      <motion.button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === quoteIndex ? 'bg-primary-foreground scale-125' : 'bg-primary-foreground/40'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => setQuoteIndex(index)}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      }
 