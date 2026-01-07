const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema(
  {
    foodId: {
      type: String,required: true,
      unique: true, // avoid duplicates
    },

    name: {
      type: String,required: true,
    },

    image: {
      type: String,required: true,
    },

    area: {
      type: String,
    },

    category: {
      type: String,
    },

    instructions: {
      type: String,
    },

    ingredients: {
      type: [String], // array of ingredients
      default: [],
    },
    price:{
        type:Number,default:100 //temporary price
    }
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Food", foodSchema);