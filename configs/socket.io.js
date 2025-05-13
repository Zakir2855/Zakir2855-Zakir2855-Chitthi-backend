const Server = require("socket.io").Server;
const http = require("http");
const express = require("express");
const { User } = require("../Schemas&Models/userSchema");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chitthi-nu.vercel.app",
      "http://localhost:5174",
    ],
  },
});

const userMap = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("setup", (userId) => {
    if (!userId) return;

    userMap.set(userId, socket.id);
    let onlineUsers = Object.fromEntries(userMap);
    io.emit("online", onlineUsers);
    console.log("UserMap after setup of online users", userMap);
  });
  //personal message handler
  socket.on("personalMessage", (toUserId, fromUserId, mssg) => {
    const recipientSocketId = userMap.get(toUserId);
    // console.log(mssg, ">>>>>>");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("personally", fromUserId, mssg);
    }

    // if to notify sender
    // socket.emit("personally", toUserId);
  });
  //

  socket.on("disconnect", async () => {
    // Clean up userMap
    for (const [user, id] of userMap) {
      if (id === socket.id) {
        await User.findByIdAndUpdate(user, { isSignedIn: false, lastOnline:new Date()});
        userMap.delete(user);
        break;
      }
    }
    //sending new online object
    let onlineUsers = Object.fromEntries(userMap);
    io.emit("online", onlineUsers);
    console.log("User disconnected:", socket.id);
    console.log("Updated UserMap:", Array.from(userMap.entries()));
  });
});

module.exports = { io, server, app };
