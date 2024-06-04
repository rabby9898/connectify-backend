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

module.exports = {
  createPost,
};
