const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);

const allowedOrigins = [
  "https://ecommerce-frontend.onrender.com",
  "https://biotronixfrontend.netlify.app",
  "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:8080",
  "http://www.ecommerce.com",
  "http://3.111.3.98:8080",
  "http://3.111.3.98:8080",
];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

exports.getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId->socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server };
