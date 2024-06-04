const express = require("express");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const postRoutes = require("./routes/post.routes.js");

const connectMongoDB = require("./db/connectMongoDB");
var cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`server is running at ${port}`);
  connectMongoDB();
});
