const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const { instrument } = require("@socket.io/admin-ui");
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

io.on("connect", (socket) => {
  let userName = socket.handshake.auth.userName;

  console.log(`${userName} joined the chat`);
  socket.broadcast.emit("user-joined", `${userName} joined the chat`);

  socket.on("send-message", (message) => {
    socket.broadcast.emit("recieve-message", message);
  });

  socket.on("disconnect", () => {
    console.log(`${userName} left the chat`);
    socket.broadcast.emit("user-left", `${userName} left the chat`);
  });
});

httpServer.listen(3000, () => {
  console.log(`Listening on port http://localhost:3000`);
});
