const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  getProfile,
  getAllUsers
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/signin", signin);

// protected routes
router.get("/profile", authMiddleware, getProfile);
router.get("/users", authMiddleware, getAllUsers);

module.exports = router;
