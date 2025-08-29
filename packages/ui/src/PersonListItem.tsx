"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, UserPlus, MessageSquare } from "lucide-react";
import ChatCard from "./Chatcard";
import { useState, useEffect } from "react";
import Sendstyle from "./send";
import useSocket from "./Socketcontext";
import { useSession } from "next-auth/react";

export const PersonListItem = ({
  person,
  onAddFriend,
  onSendMoney,
  onMessage, // <-- add handler for message
  setRefresh,
}: {
  person: any;
  onAddFriend: (to: string) => Promise<"error" | "success">;
  onSendMoney: (person: any) => void;
  onMessage?: (person: any) => void;
  setRefresh: (refresh: boolean | ((prev: boolean) => boolean)) => void;
}) => {
  const [friendRequest, setFriendRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentclicked, setSentclicked] = useState(false);
  const [messageclicked, setMessageclicked] = useState(false);
  const [online, setOnline] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as any;
  const socket = useSocket();
  useEffect(() => {

    
      socket?.emit("online", { number: person.number, sender: user?.number as string });



    const handleuserStatus = (data: { number: string; status: string }) => {
      if (data.number === person.number) {
        setOnline(data.status === "online");
      }
    };
    const handleOnline = (data: { number: string; online: boolean }) => {
      console.log("Online status received:", data);
      if (data.number === person.number) {
        setOnline(data.online);
        console.log("Setting online status for", person.number, "to", data.online);
      }
    };
    socket?.on("user-status", handleuserStatus);
    socket?.on("online", handleOnline);
    return () => {
      socket?.off("user-status", handleuserStatus);
      socket?.off("online", handleOnline);
      
    };
  }, [socket, person.number,user]);

  return (
    <AnimatePresence key={person.id}>
      {!sentclicked && !messageclicked && (
        <motion.div
          layoutId={person.id + "person"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-3 max-sm:p-2 max-sm:gap-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          {/* START OF CHANGE */}
          <motion.div className="relative flex-shrink-0">
            <motion.img
              layoutId={person.id + "image"}
              src={
                person.imageUrl ||
                "https://i.pravatar.cc/150?u=a042581f4e29026704d"
              }
              alt={person.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <motion.span
              layoutId={person.id + "status"}
              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${
                online ? "bg-green-500" : "bg-gray-400"
              }`}
              title={online ? "Online" : "Offline"}
            />
          </motion.div>
          {/* END OF CHANGE */}
          <div className="flex-1">
            <motion.p
              layoutId={person.id + "name"}
              className="font-semibold text-gray-800 textmsm max-sm:text-xs"
            >
              <motion.span className="block">
                <motion.span>{person.name}</motion.span>
              </motion.span>
            </motion.p>
            <motion.p
              layoutId={person.id + "number"}
              className="text-xs text-gray-500 max-sm:text-xs"
            >
              <motion.span className="block">
                <motion.span>{person.number}</motion.span>
              </motion.span>
            </motion.p>
          </div>

          {person.isFriend ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSentclicked(true)}
                className="p-2 rounded-full hover:bg-indigo-100 text-indigo-500"
                aria-label={`Send money to ${person.name}`}
              >
                <Send size={20} />
              </button>

              <button
                onClick={() => setMessageclicked(true)}
                className="p-2 rounded-full hover:bg-blue-100 text-blue-500"
                aria-label={`Message ${person.name}`}
              >
                <MessageSquare size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={async () => {
                setLoading(true);
                const result = await onAddFriend(person.number);
                if (result === "success") {
                  setFriendRequest(true);
                  person.isFriend = true;
                }
                setLoading(false);
              }}
              className="p-2 rounded-full hover:bg-green-100 text-green-600"
              aria-label={`Add ${person.name} as a friend`}
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-b-2 rounded-full border-gray-900" />
              ) : (
                <UserPlus size={20} />
              )}
            </button>
          )}
        </motion.div>
      )}
      {sentclicked && !messageclicked && (
        <Sendstyle
          setRefresh={setRefresh}
          person={person}
          setSentclicked={setSentclicked}
        />
      )}
      {messageclicked && (
        <ChatCard
          person={person}
          online={online}
          setOnline={setOnline}
          setMessageclicked={setMessageclicked}
        />
      )}
    </AnimatePresence>
  );
};