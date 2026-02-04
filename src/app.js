const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

const app = express();

//CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//JSON for all other routes
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/foods", require("./routes/food.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

console.log("Cashfree ENV:", process.env.CASHFREE_ENV);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
