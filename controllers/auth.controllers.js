const generateTokenAndSetCookie = require("../lib/utils/authToken.js");
const userModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const existUser = await userModel.findOne({ username });
    if (existUser) {
      return res.status(400).json({
        error: "Username is already taken!",
      });
    }

    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        error: "Email is already taken!",
      });
    }
    if (password < 6) {
      return res
        .status(400)
        .json({ error: "Password should at least 6 characters" });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullName,
      username,
      email,
      password: hashPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        followers: newUser.followers,
        following: newUser.following,
      });
    } else {
      res.status(400).json({
        error: "Invalid User Data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).send({ error: "Invalid password or username" });
    }
    generateTokenAndSetCookie(user?._id, res);

    res.status(200).send({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ error: "Logout successful" });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
};
