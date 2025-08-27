"use client";
import { io } from "socket.io-client";
import { useEffect } from "react";
const socket = io("http://localhost:8080"
);
export default function ChatPage() {
    useEffect(() => {
        socket.emit("register", "1234567890");



return () => {
    socket.off();
}
    }, []);
    return <div>Chat</div>;}