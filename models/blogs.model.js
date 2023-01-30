const mongoose = require("mongoose");
const Blog = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  email: { type: String },
  author: {
    type: String,
  },
});

const model = mongoose.model("Blog", Blog);

module.exports = model;
