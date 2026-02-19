const Food = require("../models/food.model");
const axios = require("../utils/axios");

//SYNC FOODS
exports.syncFoods = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const response = await axios.get("/search.php?s=");
    const meals = response.data.meals;

    if (!meals) {
      return res.status(404).json({ message: "No meals found" });
    }

    for (const meal of meals) {
      const ingredients = [];

      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          ingredients.push(meal[`strIngredient${i}`]);
        }
      }

      await Food.updateOne(
        { foodId: meal.idMeal },
        {
          foodId: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb,
          area: meal.strArea,
          category: meal.strCategory,
          instructions: meal.strInstructions,
          ingredients,
          price: 100
        },
        { upsert: true }
      );
    }

    res.status(200).json({ message: "Foods synced successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== GET FOODS (ALL / SINGLE / FILTER / SORT / PAGINATION / AREAS) ==========
exports.getAllFoods = async (req, res) => {
  try {
    // 🔹 Normalize query params
    const foodId = req.query.foodId || req.query.foodid;
    const {
      area,
      category,
      sort,
      page,
      limit,
      getAreas
    } = req.query;

    // =====================================================
    // TASK 14: GET AREAS LIST (PARAM ONLY)
    // =====================================================
    if (getAreas === "true") {
      const areas = await Food.distinct("area");
      return res.status(200).json({
        count: areas.length,
        areas
      });
    }

    // =====================================================
    // TASK 13: GET SINGLE FOOD ITEM (PARAM ONLY)
    // =====================================================
    if (foodId) {
      const food = await Food.findOne({ foodId });

      if (!food) {
        return res.status(404).json({ message: "Food not found" });
      }

      return res.status(200).json({
        message: "Food fetched successfully",
        food
      });
    }

    // =====================================================
    // PAGINATION
    // =====================================================
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const pageLimit = Math.max(parseInt(limit) || 10, 1);
    const skip = (currentPage - 1) * pageLimit;

    // =====================================================
    // TASK 12: COMBINED FILTERS (INDEPENDENTLY REMOVABLE)
    // =====================================================
    const filter = {};
    if (area) filter.area = area;
    if (category) filter.category = category;

    // =====================================================
    // TASK 11: SORT BY NAME
    // =====================================================
    let sortOption = { createdAt: -1 };
    if (sort === "name_asc") sortOption = { name: 1 };
    if (sort === "name_desc") sortOption = { name: -1 };

    const totalItems = await Food.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageLimit);

    // Page overflow protection
    if (currentPage > totalPages && totalItems > 0) {
      return res.status(200).json({
        totalItems,
        totalPages,
        currentPage,
        foods: []
      });
    }

    const foods = await Food.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageLimit);

    res.status(200).json({
      totalItems,
      totalPages,
      currentPage,
      foods
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
