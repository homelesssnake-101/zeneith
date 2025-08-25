import React from "react";
import { motion,AnimatePresence } from "framer-motion";
import { X, Send as SendIcon } from "lucide-react";
import axios from "axios";
import Success from "./Success";
import Error from "./Error";
import { useState,useEffect } from "react";
// This is the main component for the "Send Money" overlay.
// It's designed to be placed inside the motion.div you provided.
export default function Send({ person,setSentclicked,setRefresh}: { person: any; setSentclicked: (clicked: boolean) => void; setRefresh: (refresh: boolean| ((prev: boolean) => boolean)) => void;}) {
  // Fallback person data in case none is provided.
  const [error,setError] = useState("");
  const [note,setNote] = useState<string>("");
  const recipient = person || {
    name: "Elena Rodriguez",
    number: "+1 (555) 123-4567",
    imageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  };
  const [status,setStatus] = useState<'success'|"idle"|"error">("idle");
  const [amount,setAmount] = useState("");
  
  const [loading,setLoading] = useState(false);
  const handleSend = async () => {
    setLoading(true);
    
    const to = recipient.number;
    
    const result = await axios.post("/api/p2p/send", { amount: Number(amount), to,note });
    console.log(result.data.result);
    if(result.data.result === "success"){
      setStatus("success");
      setRefresh((prev) => !prev);
      
    }else{
      setError(result.data.result);
      setStatus("error");
    }
    setAmount("");
    setNote("");
    
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {status === "error" && <Error person={person} setStatus={setStatus} error={error} />}

      {status === "success" && <Success person={person} setStatus={setStatus} amount={amount} />}
     {status === "idle" && (
    <motion.div
      layoutId={person.id + "person"}
      className="absolute inset-0 z-100 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      // Animate the background overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main content card with its own animation */}
      <motion.div
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col items-center text-center"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0, transition: { delay: 0.1, type: "spring", stiffness: 200, damping: 20 } }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
      >
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        onClick={() => setSentclicked(false)}>
          <X size={24} />
        </button>

        {/* Recipient Information */}
        <div className="flex flex-col items-center mb-6">
          <motion.img
            layoutId={person.id + "image"}
            src={recipient.imageUrl}
            alt={recipient.name}
            className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-white shadow-lg"
          />
          <motion.div layoutId={person.id + "name"} className="text-2xl font-bold text-gray-900"><motion.span className="block" layout><motion.span layout className="block">{recipient.name}</motion.span></motion.span></motion.div>
          <motion.p layoutId={person.id + "number"} className="text-md text-gray-600"><motion.span className="block" layout ><motion.span layout className="block">{recipient.number}</motion.span></motion.span></motion.p>
        </div>

        {/* Amount Input */}
        <div className="w-full my-4">
          <label htmlFor="amount" className="sr-only">
            Amount
          </label>
          <div className="relative flex items-center justify-center">
            <span className="text-4xl font-light text-gray-400 mr-2">$</span>
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              min={0.01}
              step={1}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}              
              className="text-6xl font-bold text-gray-800 bg-transparent outline-none w-full text-center border-b-2 border-gray-200 focus:border-indigo-500 transition-colors duration-300 pb-2"
            />
          </div>
        </div>
        
        {/* Note Input (Optional) */}
        <div className="w-full my-4">
           <input
              type="text"
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-100/50 text-center border-2 border-transparent focus:border-indigo-300 focus:bg-white rounded-full py-3 px-4 outline-none transition-all duration-300"
            />
        </div>


        {/* Send Button */}
        
        <motion.button onClick={handleSend} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-6 rounded-full mt-6 shadow-lg shadow-indigo-500/40 transform hover:scale-105 hover:shadow-xl transition-all duration-300">
          
          {loading && <div className="animate-spin h-5 w-5 border-b-2 rounded-full border-gray-900" />}
          {!loading && <motion.div layoutId={person.id + "send"} ><motion.span layout className="block"><SendIcon size={20} /></motion.span></motion.div>}
          {!loading && <motion.div layoutId={person.id + "sendtext"} className="block"><motion.span layout className="block">Send Money</motion.span></motion.div>}
      </motion.button>
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}