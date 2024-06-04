const Notification = require("../models/notifications.model.js");

const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const cloudinary = require("cloudinary").v2;

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
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
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .send({ error: "You can't follow/unfollow yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(400).send({ error: "User not found!" });
    }
    const isFollowed = currentUser.following.includes(id);

    if (isFollowed) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });

      res.status(200).send({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });

      //   send Notifications to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();

      //   response user updates
      res.status(200).send({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser, controller", error.message);
    res.status(500).send({ error: error.message });
  }
};

const suggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    // filtered user
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in suggested, controller", error.message);
    res.status(500).send({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  try {
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    if (
      (!currentPassword && newPassword) ||
      (!newPassword && currentPassword)
    ) {
      return res
        .status(400)
        .send({ error: "Please provide both current password & new password" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ error: "Current password is not matched!" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .send({ error: "Password length should at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadRes = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadRes.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadRes = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadRes.secure_url;
    }

    //   update profile info
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    await user.save();

    user.password = null;

    return res.status(200).send({
      data: user,
      message: "Profile updated successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.log("Error updating", error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  followUnfollowUser,
  suggestedUser,
  updateUserProfile,
};
