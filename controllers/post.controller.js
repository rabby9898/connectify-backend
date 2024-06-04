const Post = require("../models/post.model.js");
const User = require("../models/user.model.js");
const cloudinary = require("cloudinary").v2;

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    if (!text && !img) {
      return res
        .status(400)
        .send({ error: "Please provide text or image to the post" });
    }
    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();
    res.status(200).send({
      data: newPost,
      message: "Posted successfully",
    });
  } catch (error) {
    console.log("Error updating", error.message);
    res.status(500).send({ message: error.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).send({ error: "You can not delete others post" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error updating", error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createPost,
  deletePost,
};
