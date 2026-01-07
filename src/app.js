const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/foods", require("./routes/food.routes"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
