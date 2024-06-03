const jwt = require("jwt");

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "20d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 60 * 60 * 24 * 1000,
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  });
};

module.exports = generateTokenAndSetCookie;
