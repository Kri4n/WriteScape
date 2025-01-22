// [SECTION] Dependencies and Modules
const express = require("express");
const { verify, verifyAdmin } = require("../auth");
const postController = require("../controllers/post");

// [SECTION] Routing Component
const router = express.Router();

router.post("/addPost", verify, postController.addPost);

router.get("/getAllPosts", postController.getAllPosts);

router.get("/getPost/:postId", postController.getPost);

router.get("/getMyPost", verify, postController.getMyPost);

router.patch("/updatePost/:postId", verify, postController.updatePost);

router.patch("/addComment/:postId", verify, postController.addComment);

router.get("/getComments/:postId", postController.getComments);

router.delete(
  "/deletePost/:postId",
  verify,
  verifyAdmin,
  postController.deletePost
);

router.patch(
  "/deleteComment/:postId/comments/:commentId",
  verify,
  verifyAdmin,
  postController.deleteComment
);

module.exports = router;
