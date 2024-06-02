const express = require("express");
const router = require("./routes/auth.routes");
const connectMongoDB = require("./db/connectMongoDB");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

console.log("MOngo-uri>>>>", process.env.MONGO_URI);
app.use("/api/auth", router);

app.listen(port, () => {
  console.log(`server is running at ${port}`);
  connectMongoDB();
});
