const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send({
        error: "Unauthorized user access",
      });
    }
    const decoded = jwt.verify(token, process.env, ACCESS_TOKEN_KEY);
    if (!decoded) {
      return res.status(401).send({
        error: "Invalid user access",
      });
    }
    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).send({
        error: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({
      error: "Sever Error",
    });
  }
};
module.exports = protectedRoute;
