//packages
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

//mongoDB connnection setup
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

mongoose.set("strictQuery", true);
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongoDB success");
});

//routes
const blogRouter = require("./routes/blog.js");
app.use("/", blogRouter);
const userRouter = require("./routes/user.js");
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log("Server started on port 5000");
});
