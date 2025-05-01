const env = require("dotenv");
env.config();
const { app, server, io } = require("./configs/socket.io");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { userRouter } = require("./Routers/userRouter");
const { mssgRouter } = require("./Routers/message.router");
const { DBconnect } = require("./configs/db.config");
const { cloudinaryConfig } = require("./configs/cloudinary");

const PORT = process.env.PORT || 6001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173","https://chitthi-nu.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/user", userRouter);
app.use("/mssg", mssgRouter);

// Server listen
server.listen(PORT, (err) => {
  if (err) {
    console.log(err, "in listening");
  } else {
    DBconnect();
    cloudinaryConfig();
    console.log(`Server is listening at PORT: ${PORT}`);
  }
});
