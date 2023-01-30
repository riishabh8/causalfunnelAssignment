const router = require("express").Router();
const User = require("../models/user.model");
const Blog = require("../models/blogs.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

//Thanks for considering me 
//reading all the blogs
router.route("/").get(async (req, res) => {
  try {
    const page = req.query.page || 1;
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const blogs = await Blog.find();
    const result = blogs.slice(startIndex, endIndex);
    return res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: "error" });
  }
});

//creating blogs
router.route("/").post(async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const email = decoded.email;
    const author = decoded.name;
    const title = req.body.title;
    const content = req.body.content;

    const newBlogData = {
      author,
      email,
      title,
      content,
    };

    const newBlog = new Blog(newBlogData);

    await newBlog.save();
    return res.status(200).json({ message: "Created new Blog" });
  } catch (error) {
    return res.status(400).json({ status: "error", error: "invalid token" });
  }
});



//deleting only if the user is authenticated and is the creator of the blog
router.route("/").delete(async (req, res) => {
  const token = req.headers["x-access-token"];
  const id = req.body.id;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const email = decoded.email;
    const data = await Blog.findById(id);
    if (data.email === email) {
      await Blog.deleteOne({ _id: id });
      return res.status(200).json({ message: "Deleted", data: id });
    } else {
      return res
        .status(400)
        .json({ message: "Different user created the blog", data: id });
    }
  } catch (error) {
    return res.status(400).json({ status: "error", error: "invalid token" });
  }
});



//updating only if the user is authenticated and is the creator of the blog

router.route("/").put(async (req, res) => {
  const token = req.headers["x-access-token"];
  const id = req.body.id;
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const email = decoded.email;
    const data = await Blog.findById(id);
    if (data.email === email) {
      const title = req.body.title || data.title;
      const content = req.body.content || data.content;
      await Blog.updateOne({ _id: id }, { title: title, content: content });
      return res.status(200).json({ message: "Updated", data: id });
    } else {
      return res
        .status(400)
        .json({ message: "Different user created the blog", data: id });
    }
  } catch (err) {
    return res.status(400).json({ status: "error" });
  }
});

module.exports = router;


