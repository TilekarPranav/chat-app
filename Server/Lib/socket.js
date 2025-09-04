import { Server } from "socket.io";

let io;
export const userSocketMap = {};

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("✅ User Connected:", userId);

    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("❌ User Disconnected:", userId);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export const getIo = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
