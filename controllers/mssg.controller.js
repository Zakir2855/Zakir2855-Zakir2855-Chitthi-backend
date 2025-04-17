const { Message } = require("../Schemas&Models/message.schema");
const { User } = require("../Schemas&Models/userSchema");
const cloudinary=require("cloudinary").v2;


async function GetUsers(req, resp) {
  let currentUserId = req.userInfo.id;
  console.log(currentUserId);
  try {
    let users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    );
    if (!users) {
      console.log("error in finding user");
      return resp.status(500).json({ message: "internal server error" });
    }
    return resp
      .status(200)
      .json({ message: "users fetched successfully", users: users });
  } catch (err) {
    console.log("error in getting users controller", err);
    return resp.status(500).json({ message: "internal server error" });
  }
}
//to get all the messages between to users
async function AllMessages(req, resp) {
  let receiverId = req.params.id;
  let senderId = req.userInfo.id;
  try {
    let allMessages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    if (!allMessages) {
      console.log(err, "error in fetching messages");
      return resp.status(500).json({ message: "Internal server Error" });
    }
    return resp.status(200).json({
      message: "messages fetched successfully",
      messages: allMessages,
    });
  } catch (err) {
    console.log(err, "error in message controller");
    return resp.status(500).json({ message: "Internal server Error" });
  }
}
//send message
async function Send(req, resp) {
  try {
    //file after multer configurations
    console.log(req.file, "body");
    const { text } = req.body;

    let Fimage = "";
    if (req.file) {
      Fimage = req.file.path.replace(/\\/g, "/");//to replace windows notations
    }

    const receiverId = req.params.id;
    const senderId = req.userInfo.id;

    const message = await Message.create({
      senderId,
      receiverId,
      text,
      image: Fimage
    });

    console.log(message, "message creation successful");


    return resp.status(201).json({
      message: "Message created successfully",
      data: message
    });
  } catch (err) {
    console.log(err, "error in sender");
    return resp.status(500).json({ message: "Internal server Error" });
  }
}

//
module.exports = { GetUsers, AllMessages, Send };
