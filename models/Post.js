const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userID: {
      type: "string",
      required: true,
    },
    content: {
      type: "string",
      required: true,
      max: 400,
    },
    img: {
      type: "string",
    },
    likes: {
      type: "array",
      default: [],
    },
    updated: {
      type: "boolean",
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
