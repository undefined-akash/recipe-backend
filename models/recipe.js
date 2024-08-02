const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: String,
  amount: String,
}, { _id: false });

const stepsSchema = new mongoose.Schema({
  description: String,
},{_id: false});

const recipeSchema = new mongoose.Schema({
  recipeBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tags:[{
    type:String,
    required: true, 
  }],
  imageUrl: {
    type: String,
    required: true,
  },
  ingredients: {
    type:[ingredientSchema],
    required: true,
  },
  upVotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UpVote",
  }],
  rating: {
    type: Number,
    default:0,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
