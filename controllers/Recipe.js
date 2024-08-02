const Recipe = require("../models/recipe");
const User = require("./../models/user");
const cloudinary = require('cloudinary').v2;

function isFileSupported (type,supportedTypes) {
  return supportedTypes.includes(type)
}

async function uploadFileToCloudinary (file,folder){
  const options = {folder}
  return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.createRecipe = async (req, res) => {
  try {
    const { recipeBy, title,tags, ingredients } = req.body;
    const file = req.files.recipeImg;
    let parsedTags, parsedIngredients;
    try {
      parsedTags = JSON.parse(tags)
      parsedIngredients = JSON.parse(ingredients);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ingredients format',
      });
    }
    if (!recipeBy || !title || !ingredients) {
      throw new Error("Error in recipe fields");
    }
    const fileType = file.name.split('.').pop().toLowerCase();
    const supportedTypes = ["jpg", "png", "jpeg"];
    if (!isFileSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: 'File format not supported'
      });
    }

    const response = await uploadFileToCloudinary(file, "RecipeKeeperProject");
    console.log(response);
    const recipe = await Recipe.create({
      recipeBy: recipeBy,
      title: title,
      tags:parsedTags,
      imageUrl:response.secure_url,
      ingredients: parsedIngredients
    });

    console.log(recipe);
    const user = await User.findById(recipeBy);
    if (!user) {
      throw new Error("Error while saving recipe to user collection");
    }
    user.recipes.push(recipe._id);
    await user.save();

    res.status(200).json({
      success: true,
      recipe: recipe,
      message: "Recipe created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while creating recipe",
    });
  }
};

exports.getRecipeByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Could not find User");
    }

    const recipes = await Recipe.find({ _id: { $in: user.recipes } });

    res.status(200).json({
      success: true,
      data: recipes,
      message: "Recipes found successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while retrieving recipes",
    });
  }
};

exports.upVoteRecipe = async (req, res) => {
  try {
    const { recipeId, userId } = req.body;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (recipe.upVotes.includes(userId)) {
      throw new Error("User has already upvoted this recipe");
    }
    recipe.upVotes.push(userId);
    await recipe.save()
    const Votes = user.upVotes;
    user.upVotes = Votes + 1;
    user.save();
    console.log("Recipe upvoted successfully")
    res.status(200).json({
      success: true,
      message: `UpVotes for ${recipe.title}`,
      currentUpVotes: recipe.upVotes.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Erro while upvoting a recipe",
    });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    // console.log(recipes);
    res.status(200).json({
      success: true,
      recipes: recipes,
      message: "All recipes fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching recipes",
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const user = await User.findById(recipe.recipeBy);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Recipe.findByIdAndDelete(id);

    user.recipes.pull(id); 
    await user.save();

    res.status(200).json({  
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to delete recipe",
    });
  }
};

exports.getRecipeById = async(req,res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    // console.log(recipe);
    res.status(200).json({
      success: true,
      recipe: recipe,
      message: "Recipe fetched successfully",
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch recipe",
    })
  }
}