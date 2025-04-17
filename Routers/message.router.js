const express=require("express");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })

const { GetUsers, AllMessages, Send } = require("../controllers/mssg.controller");
const { IsLoggedIn } = require("../middlewares/isLoggedIn");
const mssgRouter=express.Router();

mssgRouter.get("/users",IsLoggedIn,GetUsers)
mssgRouter.get("/allMessages/:id",IsLoggedIn,AllMessages)
mssgRouter.post("/sendMessage/:id",IsLoggedIn,upload.single('image'),Send)


module.exports={mssgRouter};