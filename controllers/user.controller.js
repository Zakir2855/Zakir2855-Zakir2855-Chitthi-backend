const { User } = require("../Schemas&Models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function SignUp(req, res) {
  try {
    const { Name, email, password, confirm_password, profile_picture } =
      req.body;
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Passwords must be of atleast 8 characters DOST" });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    //
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log(existingUser);
      return res.status(403).json({ message: "User already exists" });
    }

    //
    // const newUser = new User({
    //   Name,
    //   email,
    //   password,
    //   profile_picture,
    //   lastOnline: new Date(),
    // });

    // await newUser.save();
  const newUser = await User.create({
  Name,
  email,
  password,
  profile_picture,
  lastOnline: new Date(),  
});
    if (newUser) {
      return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } else {
      return res.status(402).json({ message: "invalid user data" });
    }
  } catch (err) {
    if (err.code === 11000) {
      // handling Duplicate Key Error of mongodb
      return res.status(400).json({ error: "Email already exists" });
    }

    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
//adding profile images
async function UploadAvatar(req, res) {
  try {
    const userDetails = await User.findById(req.params.id);
    if (!userDetails) {
      return res
        .status(404)
        .json({ message: "Can't find user or you are not logged in." });
    }

    userDetails.avatar = req.file.path.replace(/\\/g, "/");
    await userDetails.save();

    return res.status(200).json({
      message: "Avatar successfully uploaded",
      user_data: {
        Name: userDetails.Name,
        avatar: userDetails.avatar,
        id: userDetails._id.toString(),
        email: userDetails.email,
      },
    });
  } catch (err) {
    console.error("Error in UploadAvatar:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//login function and assigning token
async function Login(req, resp) {
  try {
    if (!req.body) {
      return resp.status(400).json({ message: "Please provide user details" });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return resp.status(401).json({ message: "Email not registered" });
    }

    if (user.isSignedIn) {
      return resp
        .status(409)
        .json({ message: "User already logged in on a device" });
    }

    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      return resp.status(403).json({ message: "Password doesn't match" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    user.isSignedIn = true;
    user.lastOnline = new Date();
    await user.save();

    if (process.env.NODE_ENV !== "production") {
      console.log(`Login success for user: ${user._id}`);
    }

    resp
      .status(200)
      .cookie("lgntkncof", token, {
        //lgn tkn
        httpOnly: true, //false means can be accessed by js risky
        secure: true, //cookie can be sent over http and https both
        sameSite: "None",
      })
      .json({
        message: "User logged in successfully",
        user_data: {
          Name: user.Name,
          avatar: user.avatar,
          id: user._id,
          email: user.email,
        },
      });
  } catch (err) {
    console.error("Error in login controller:", err);
    resp.status(500).json({ message: "Internal server error" });
  }
}

//logout
async function Logout(req, resp) {
  const userId = req.params.id;
  if (!userId) {
    return resp.status(400).json({ message: "User ID is required" });
  }

  try {
    await User.findByIdAndUpdate(userId, {
      isSignedIn: false,
      lastOnline: new Date(),
    });

    resp
      .cookie("lgntkncof", "", {
        maxAge: 0,
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error in logout controller:", err);
    return resp.status(500).json({ message: "Internal server error" });
  }
}

//
module.exports = { SignUp, UploadAvatar, Login, Logout };
// httpOnly: false,
//  secure: false,
//  sameSite: "Lax",

//httpOnly: true, // so only browser can use it, not JS
//secure: true,   // cookie only sent over HTTPS
//sameSite: "None", // allows cross-origin cookies
