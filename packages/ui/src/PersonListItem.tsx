"use client";
import { motion,AnimatePresence } from "framer-motion";
import { Send, UserPlus } from "lucide-react";
import { useState } from "react";
import Sendstyle from "./send";

export const PersonListItem = ({ person, onAddFriend,onSendMoney,setRefresh }: { person: any, onAddFriend: (to: string) => Promise<"error"|"success">,onSendMoney: (person: any) => void,setRefresh: (refresh: boolean| ((prev: boolean) => boolean)) => void }) => {
   const [friendRequest,setFriendRequest] = useState(false);
   const [loading,setLoading] = useState(false);
   const [sentclicked,setSentclicked] = useState(false);
   
    return<AnimatePresence key={person.id}> {!sentclicked ? <motion.div
        
        layoutId={person.id+"person"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-3 max-sm:p-2 max-sm:gap-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
        <motion.img layoutId={person.id+"image"} src={person.imageUrl||"https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt={person.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
            <motion.p layoutId={person.id+"name"} className="font-semibold text-gray-800 textmsm max-sm:text-xs"> <motion.span className="block"><motion.span>{person.name}</motion.span></motion.span></motion.p>
            <motion.p layoutId={person.id+"number"} className="text-xs text-gray-500 max-sm:text-xs"><motion.span className="block"><motion.span>{person.number}</motion.span></motion.span></motion.p>
        </div>
        <button
            onClick={async () => {if(person.isFriend){setSentclicked(true);}else{ setLoading(true); const result = await onAddFriend(person.number);  if(result==="success"){setFriendRequest(true); person.isFriend=true;}  setLoading(false);}}}
            className={`p-2 rounded-full transition-colors duration-200 ${person.isFriend ? 'hover:bg-indigo-100 text-indigo-500' : 'hover:bg-green-100 text-green-600'}`}
            aria-label={person.isFriend ? `Send money to ${person.name}` : `Add ${person.name} as a friend`}
        >
{loading && <div className="animate-spin h-5 w-5 border-b-2 rounded-full border-gray-900" />}


            {!loading && (person.isFriend ?  <motion.div layoutId={person.id + "send"}> <motion.span layout className="block"><Send size={20 } /></motion.span></motion.div> : <UserPlus size={20} />)}
        </button>
    </motion.div>: <Sendstyle setRefresh={setRefresh} person={person} setSentclicked={setSentclicked} /> }
    
    
    
    </AnimatePresence>
}