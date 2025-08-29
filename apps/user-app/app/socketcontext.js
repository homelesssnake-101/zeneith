"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect } from "react";
import { io, } from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
export const SocketContext = createContext(socket);
export const SocketProvider = ({ children }) => {
    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);
    return (_jsx(SocketContext.Provider, { value: socket, children: children }));
};
export default function useSocket() {
    return useContext(SocketContext);
}
