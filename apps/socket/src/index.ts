import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { PrismaClient } from "@repo/prisma/client";

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
  },
});

export const userSocketMap: Record<string, string> = {};

// Define a more specific type for the incoming message data from the client
interface MessageData {
  id: string;
  toPhone: string;
  fromPhone: string;
  message: string;
  type: string;
  timestamp: Date; // This is the correct ISO-8601 timestamp
  time: string;
  imageUrl?: string;
  imageCaption?: string;
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (phone: string) => {
    if (phone) {
      userSocketMap[phone] = socket.id;
      console.log(`User ${phone} registered with socket ID ${socket.id}`);
    }
  });

  // ✅ FIX: Correctly handle the incoming message data
  socket.on("message", async (data: MessageData) => {
    
    try {
      // 1. Create the message in the DB using specific fields, not ...data
      const createdMessage = await prisma.chats.create({
        data: {
          id: data.id, // 2. Use the ID from the client for consistency
          toPhone: data.toPhone,
          fromPhone: data.fromPhone,
          message: data.message,
          type: data.type,
          imageUrl: data.imageUrl,
          imageCaption: data.imageCaption,
          timestamp: data.timestamp, // 3. Use the correct ISO timestamp field
          time: data.time,
          status: "pending",
        },
      });

      const recipientSocketId = userSocketMap[data.toPhone];
      if (recipientSocketId) {
        // Recipient is online, emit the message


        // Update status to 'delivered' and notify the sender
        const deliveredMessage = await prisma.chats.update({
          where: { id: createdMessage.id },
          data: { status: "delivered" },
        });

        const senderSocketId = userSocketMap[data.fromPhone];
        if (senderSocketId) {
            // Notify sender that the message was delivered
            io.to(senderSocketId).emit("ack-delivered", deliveredMessage);
        }
        io.to(recipientSocketId).emit("message", createdMessage);
      }
    } catch (error) {
      console.error("Failed to process message:", error);
    }
  });

  socket.on("ack-seen", async (msg:MessageData) => {
    try {
        const message = await prisma.chats.findUnique({ where: { id: msg.id } });
        if (message) {
            const updatedMessage = await prisma.chats.update({
                where: { id: msg.id },
                data: { status: "seen" },
            });
            const senderSocketId = userSocketMap[message.fromPhone];
            if (senderSocketId) {
                io.to(senderSocketId).emit("ack-seen", updatedMessage);
            }
        }
    } catch(error){
        console.error("Failed to process ack-seen:", error);
    }
  });

  socket.on("disconnect", () => {
    for (const phone in userSocketMap) {
      if (userSocketMap[phone] === socket.id) {
        delete userSocketMap[phone];
        console.log(`User ${phone} disconnected`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);