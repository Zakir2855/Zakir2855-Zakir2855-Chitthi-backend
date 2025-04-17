const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

const mongoose = require("mongoose");
let userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: [true, "Please enter your  Name"],
      minLength: 3,
    },

    email: {
      type: String,
      lowercase: true,
      required: [true, "Please enter your email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Provide the valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please input the user Password"],
      minLength: [8, "password atleast must be of 8 characters"],
    },

    avatar: {
      type: String,
      default: "",
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);

      next();
    }
    if (this.isModified("avatar")) {
      let result = await cloudinary.uploader.upload(this.avatar);
      this.avatar = result.secure_url;
      next();
    } else {
      next();
    }
  } catch (err) {
    console.log(err, "error in password encryption");
    return;
  }
});
let User = mongoose.model("users", userSchema);

module.exports = { User };
