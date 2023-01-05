const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update User
router.put("/:id", async (req, res) => {
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .render("Your are not allowed to update this account");
  }
});
// Delete User
router.delete("/:id", async (req, res) => {
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can only delete your account");
  }
});
// Get a User
router.get("/:id", async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, isAdmin, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// Follow a User
router.put("/:id/follow", async function (req, res) {
  if (req.body.userID !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userID);
      if (!user.followers.includes(req.body.userID)) {
        await user.updateOne({ $push: { followers: req.body.userID } });
        await currentUser.updateOne({ $push: { followings: req.body.userID } });
        res.status(200).json("User is being followed");
      } else {
        res.status(403).json("you are already following the user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(200).json("You can't follow yourself");
  }
});
// Unfollow a User
router.put("/:id/unfollow", async function (req, res) {
  if (req.body.userID !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userID);
      if (user.followers.includes(req.body.userID)) {
        await user.updateOne({ $pull: { followers: req.body.userID } });
        await currentUser.updateOne({ $pull: { followings: req.body.userID } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("you are already not following the user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(200).json("You can't unfollow yourself");
  }
});

module.exports = router;
