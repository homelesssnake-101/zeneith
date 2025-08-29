"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

type SocketContextType = Socket | null;

export const SocketContext = createContext<SocketContextType>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();
  const user = session?.user as { number?: string } | undefined;

  useEffect(() => {
    // Only run on client-side
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user?.number) {
      socket.emit("register", user.number);
    }
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