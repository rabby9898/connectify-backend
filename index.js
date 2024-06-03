const express = require("express");
const router = require("./routes/auth.routes");
const connectMongoDB = require("./db/connectMongoDB");
var cookieParser = require("cookie-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", router);

app.listen(port, () => {
  console.log(`server is running at ${port}`);
  connectMongoDB();
});
