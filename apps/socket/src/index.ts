import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3001", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true
});
export interface SocketData {
    toPhone: string;
    fromPhone: string;
    message: string;
    imageUrl?: string;
    imageCaption?: string;
    type: "text" | "image";
  }
  
export const userSocketMap: Record<string, string> = {};
  

io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);
  socket.on("register", (phone: string) => {
    console.log(phone);
    userSocketMap[phone] = socket.id;
  });
  socket.on("message", (data: SocketData) => {
    console.log(data);
    const toSocketId = userSocketMap[`${data.toPhone}`];
    if (toSocketId) {
      io.to(toSocketId).emit("message", data);
    }
  });
  
  socket.on("disconnect", () => {
    console.log("user disconnected" + socket.id);
    for (const [phone, id] of Object.entries(userSocketMap)) {
        if (id === socket.id) {
          delete userSocketMap[phone];
          break;
        }
      }
  });
});

httpServer.listen(8080, () => {
  console.log("Server is running on port 8080");
});

app.get("/isOnline/:number", (req, res) => {
    res.json({isOnline: isOnline(req.params.number)});
});
export function isOnline(number: string): boolean {
    return !!userSocketMap[number];
}