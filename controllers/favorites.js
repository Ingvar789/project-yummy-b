const { Recipe } = require("../models/recipe");
const { User } = require("../models/user");
const controlWrapper = require("../decorators/controllWrapper");
const { HttpError } = require("../helpers");

const controllerGetAllFavorites = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  const favorites = user.favorites;

  res.json(favorites);
};

const controllerGetFavorites = async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);

  const favoriteRecipeIds = user.favorites;

  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1) * limit;
  const totalRecipes = favoriteRecipeIds.length;

  const favoriteRecipes = await Recipe.find({
    _id: { $in: favoriteRecipeIds },
  })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalRecipes / limit);

  const favoriteRecipeInfo = favoriteRecipes.map((recipe) => {
    return {
      _id: recipe._id,
      title: recipe.title,
      thumb: recipe.thumb,
      instructions: recipe.instructions,
      description: recipe.description,
      preview: recipe.preview,
      time: recipe.time,
    };
  });

  res.status(200).json({
    favoriteRecipeInfo,
    currentPage: page,
    totalPages,
  });
};

const controllerAddToFavorites = async (req, res) => {
  const { recipeId } = req.params;
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw HttpError(404, "Recipe not found");
  }

  const isFavorite = user.favorites.includes(recipeId);
  if (isFavorite) {
    throw HttpError(409, "Recipe is already added to favorites");
  }

  await User.findByIdAndUpdate(
    id,
    { $push: { favorites: recipeId } },
    { new: true }
  );

  await Recipe.findByIdAndUpdate(recipeId, {
    favoritesCounter: (recipe.favoritesCounter += 1),
  });

  res.status(201).json({
    message: `Recipe id=${recipeId} added to favorites successfully`,
  });
};

const controllerDeleteFromFavorites = async (req, res) => {
  const { recipeId } = req.params;
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.favorites.length === 0) {
    res.status(200).json({
      message: "You don't have any favorite recipes yet.",
    });
    return;
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw HttpError(404, "Recipe not found");
  }

  await User.findByIdAndUpdate(
    id,
    { $pull: { favorites: recipeId } },
    { new: true }
  );

  await Recipe.findByIdAndUpdate(recipeId, {
    favoritesCounter: (recipe.favoritesCounter -= 1),
  });

  res.status(200).json({
    message: `Recipe id=${recipeId} deleted from favorites successfully`,
  });
};

module.exports = {
  controllerGetAllFavorites: controlWrapper(controllerGetAllFavorites),
  controllerGetFavorites: controlWrapper(controllerGetFavorites),
  controllerAddToFavorites: controlWrapper(controllerAddToFavorites),
  controllerDeleteFromFavorites: controlWrapper(controllerDeleteFromFavorites),
};
