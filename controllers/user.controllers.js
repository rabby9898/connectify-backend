const userModel = require("../models/user.model.js");

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username }).select("-password");
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in getUserProfile controller", error.message);
    res.status(500).send({ error: error.message });
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await userModel.findById(id);
    const currentUser = await userModel.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).send({ error: "You can't follow yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(400).send({ error: "User not found!" });
    }
    const isFollowed = currentUser.following.includes(id);

    if (isFollowed) {
      // unfollow the user
      await userModel.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await userModel.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      res.status(200).send({ message: "User unfollowed successfully" });
    } else {
      // follow the user
      await userModel.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await userModel.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      res.status(200).send({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser, controller", error.message);
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  followUnfollowUser,
};
