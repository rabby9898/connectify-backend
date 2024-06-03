const generateTokenAndSetCookie = require("../lib/utils/authToken");
const userModel = require("../models/user.model");

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

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
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
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        followers: newUser.followers,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({
        error: "Invalid User Data",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Server error",
    });
  }
};
const login = async (req, res) => {
  res.json({
    data: "Login up endpoint",
  });
};
const logout = async (req, res) => {
  res.json({
    data: "Logout up endpoint",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
