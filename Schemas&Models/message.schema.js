const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

const mongoose = require("mongoose");
let messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
      default:""
    },
  },
  { timestamps: true }
);
//uploadin message image to cloudinary
messageSchema.pre("save", async function (next) {
  try {
    if (this.isModified("image") && this.image) {
      const result = await cloudinary.uploader.upload(this.image);
      this.image = result.secure_url;
    }
    next();
  } catch (err) {
    console.log(err, "error in Cloudinary upload during message save");
    next(err); 
  }
});

// userSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified("password")) {
//       this.password = await bcrypt.hash(this.password, 10);

//       next();
//     }
//     if(this.isModified("avatar")){
//       let result = await cloudinary.uploader.upload(this.avatar);
//       this.avatar=result.secure_url;
//       next();
//     }
//     else{
//       next();
//     }

//   } catch (err) {
//     console.log(err,"error in password encryption");
//     return ;
//   }
// });
let Message = mongoose.model("Message", messageSchema);

module.exports = { Message };
