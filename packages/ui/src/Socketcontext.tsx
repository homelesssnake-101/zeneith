"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

type SocketContextType = Socket | null;

export const SocketContext = createContext<SocketContextType>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();
  const user = session?.user as any;

  useEffect(() => {
    if(!user?.number) return;
    
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    
    // Wait for connection before registering
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit("register", user.number);
      
    });

    setSocket(newSocket);

    return () => {
      
      newSocket.disconnect();
    };
  }, [user?.number]); // Only depend on user.number

  useEffect(() => {
    if(!socket || !user?.number) return;

    async function delivered(){
      console.log("Delivered called for user:", user.number);
      
      try {
        const res = await fetch("/api/delivered", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" } 
        });
        const updatedChats = await res.json();
        
        if(updatedChats.length > 0){
          console.log("Emitting delivered messages:", updatedChats.length);
          updatedChats.forEach((chat: any) => {
            socket?.emit("delivered", chat);
          });
        }
      } catch (error) {
        console.error("Error in delivered function:", error);
      }
    }
    
    // Wait a bit for socket to be properly registered
    const timer = setTimeout(delivered, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [socket, user?.number]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default useSocket;