const router = require("express").Router();
const Post = require("../models/Post");

// create a post

router.get("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
// update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userID === req.body.userID) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("can't update because it's not your own post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userID === req.body.userID) {
      await post.deleteOne({ $set: req.body });
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("can't delete because it's not your own post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// like and dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userID)) {
      await post.updateOne({ $push: { likes: req.body.userID } });
      res.status(200).json("post liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userID } });
      res.status(200).json("post disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all posts
router.get("/home/all", async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
