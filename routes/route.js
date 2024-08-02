const express = require("express");
const router = express.Router();

//User routes
const {
  login,
  signup,
  updateProfile,
  getUserByUserName,
  getUserById,
  getAllUser
} = require("./../controllers/Auth");
router.post("/login", login);
router.post("/signup", signup);
router.put("/user/updateProfile/:id", updateProfile);
router.get("/user/allUsers",getAllUser);
router.get("/user/:userName", getUserByUserName);
router.get("/user/get/:id",getUserById);

//File upload
const {profileUpload} = require("../controllers/FileUpload");
router.post("/user/profileUpload", profileUpload);

//Recipe routes
const {
  createRecipe,
  getRecipeByUser,
  upVoteRecipe,
  getRecipes,
  deleteRecipe,
  getRecipeById
} = require("./../controllers/Recipe");
router.post("/recipe/create", createRecipe);
router.post("/recipe/upVote", upVoteRecipe);
router.get("/recipe/get/:id", getRecipeByUser);
router.get("/recipes",getRecipes);
router.delete('/recipe/delete/:id',deleteRecipe)
router.get('/recipes/:id',getRecipeById)

module.exports = router;
