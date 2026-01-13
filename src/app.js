const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/foods", require("./routes/food.routes"));
app.use("/api/cart", require("./routes/cart.routes"));

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
