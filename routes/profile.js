const express = require("express");
const {getProfile, updateProfile} = require("../controllers/profile");
const {authenticateUser} = require("../middlewares/auth");
const router = express.Router();
// Middleware to authenticate user
router.use(authenticateUser)
// router.use(authenticateUser);
// Route to get user profile
router.get("/", getProfile);
// Route to update user profile
// router.route("/update").put(authenticateUser, updateProfile);
// Route to update user profile

router.put("/", updateProfile);
module.exports = router;

