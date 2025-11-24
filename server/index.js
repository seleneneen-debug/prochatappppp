const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in this demo
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    // Broadcast to everyone in the room INCLUDING the sender (or exclude sender if preferred, but usually we want to confirm receipt)
    // Actually, usually we broadcast to others. The sender can optimistically add it or wait for ack.
    // For simplicity, let's broadcast to the room (excluding sender) and sender handles their own display, 
    // OR broadcast to everyone. Let's broadcast to everyone in the room including sender for absolute sync.
    io.in(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
