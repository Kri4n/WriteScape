const express = require("express");
const router = express.Router();
const { verify } = require("../auth");
const userController = require("../controllers/user");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);

module.exports = router;
