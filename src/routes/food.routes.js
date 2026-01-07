const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  syncFoods,
  getAllFoods
} = require("../controllers/food.controller");

// Admin only – sync foods
router.post("/sync", auth, syncFoods);

// Handles:
// - Get all foods
// - Get single food (?foodId=)
// - Filters (?area=&category=)
// - Sorting (?sort=name_asc)
// - Pagination (?page=&limit=)
// - Areas list (?getAreas=true)
router.get("/", getAllFoods);

module.exports = router;
