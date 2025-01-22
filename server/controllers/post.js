const Post = require("../models/Post");
const User = require("../models/User");
const { errorHandler } = require("../auth");

const addPost = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const newPost = new Post({
        title,
        content,
        userId,
        username: user.username,
      });

      return newPost
        .save()
        .then((result) => res.status(201).send(result))
        .catch((error) => errorHandler(error, req, res));
    })
    .catch((error) => errorHandler(error, req, res));
};

const getAllPosts = (req, res) => {
  return Post.find()
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => errorHandler(error, req, res));
};

const getPost = (req, res) => {
  return Post.findOne({ _id: req.params.postId })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => errorHandler(error, req, res));
};

const getMyPost = (req, res) => {
  return Post.find({ userId: req.user.id })
    .then((result) => {
      if (!result.length) {
        return res
          .status(404)
          .send({ message: "No posts found for this user." });
      }
      return res.status(200).send(result);
    })
    .catch((error) => errorHandler(error, req, res));
};

const updatePost = (req, res) => {
  let updatedPost = {
    title: req.body.title,
    content: req.body.content,
  };

  return Post.findOneAndUpdate(
    { _id: req.params.postId, userId: req.user.id },
    updatedPost,
    { new: true }
  )
    .then((result) => {
      if (result) {
        return res.status(200).send({
          message: "Post updated successfully",
          updatedPost: result,
        });
      } else {
        return res.status(404).send({ error: "Post does not exist" });
      }
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

const addComment = (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const newComment = {
        userId: req.user.id,
        username: user.username,
        comment: req.body.comment,
      };

      return Post.findByIdAndUpdate(
        req.params.postId,
        { $push: { comments: newComment } },
        { new: true }
      )
        .then((result) => {
          if (!result) {
            return res.status(404).send({ message: "Post not found" });
          }
          return res.status(201).send(result);
        })
        .catch((error) => errorHandler(error, req, res));
    })

    .catch((error) => errorHandler(error, req, res));
};

const getComments = (req, res) => {
  return Post.findById(req.params.postId, "comments")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => errorHandler(error, req, res));
};

const deletePost = (req, res) => {
  return Post.findByIdAndDelete(req.params.postId)
    .then((result) => {
      res.status(200).send({ message: "Post deleted successfully" });
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

const deleteComment = (req, res) => {
  return Post.findByIdAndUpdate(
    req.params.postId,
    { $pull: { comments: { _id: req.params.commentId } } },
    { new: true }
  )
    .then((result) => {
      return res.status(200).send({ message: "Comment deleted successfully" });
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

module.exports = {
  addPost,
  getAllPosts,
  getPost,
  addComment,
  getComments,
  deletePost,
  deleteComment,
  updatePost,
  getMyPost,
};
