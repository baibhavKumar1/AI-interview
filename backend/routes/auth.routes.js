const express = require("express");
const authRouter = express.Router();
const upload = require("../middlewares/upload.middleware");
const User = require("../models/User.model");

authRouter.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    const profileImage = req.file ? req.file.path : null;
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    } else {
      bcrypt.hash(password, 8, async function (err, hash) {
        const newUser = new User({
          username, email, password: hash, bio, profileImage, pastInterviews: []
        });
        try {
          await newUser.save();
          res.status(201).json({ message: "User registered successfully", user: newUser });
        }
        catch (err) {
          return res.status(400).json({ message: "User registration failed" });
        }
      });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          var token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
          res.status(200).json({ message: `Welcome back ${user.name}`, token: token, user: user });
        } else {
          return res.status(400).json({ message: "Invalid Credentials" });
        }
      });
    } else {
      return res.status(400).json({ message: "User doesn't exist" });
    }
  } catch (er) {
    return res.status(400).json({ message: er.message });
  }
})

authRouter.get("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const data = new BlackList({ token: token });
    await data.save();
    res.status(200).json({ message: "Logged out" });
  } else {
    return res.status(400).json({ message: "Logout failed" });
  }
});

authRouter.get("/data", async (req, res) => {
  const userId = req.headers.authorization?.split(" ")[1];
  try {
    const user = await User.findById(userId).populate("pastInterviews");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = authRouter;
