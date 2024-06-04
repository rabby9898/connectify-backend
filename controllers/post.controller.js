const Notification = require("../models/notifications.model.js");
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
      return res.status(400).json({ error: "User not found" });
    }
    if (!text && !img) {
      return res.status(400)({
        error: "Please provide text or image to the post",
      });
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
    res.status(500).json({ message: error.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You can not delete others post" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting", error.message);
    res.status(500).json({ message: error.message });
  }
};
const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(401).json({ error: "Text field required!" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({ error: "Post not found" });
    }
    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(200).send(post);
  } catch (error) {
    console.log("Error commenting", error.message);
    res.status(500).json({ error: error.message });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ error: "Post not found!" });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // unlike post
      await Post.updateOne({ id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Dislike post" });
    } else {
      // like post
      post.likes.push(userId);
      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      res.status(200).json({ message: "Post like successfully" });
    }
  } catch (error) {
    console.log("Error deleting", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
};
