const express=require("express");
const {  SignUp, UploadAvatar, Login, Logout } = require("../controllers/user.controller");
const multer  = require('multer');
const { IsLoggedIn } = require("../middlewares/isLoggedIn");
const upload = multer({ dest: 'uploads/' })
const userRouter=express.Router();
userRouter.post("/signup",SignUp);
userRouter.patch("/uploadAvatar/:id",upload.single('avatar'),UploadAvatar);
userRouter.post("/login",Login);
userRouter.post("/logout/:id",IsLoggedIn,Logout);
module.exports={userRouter};