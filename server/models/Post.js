const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comments: [
    {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
