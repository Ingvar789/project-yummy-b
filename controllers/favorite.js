const { Recipe } = require("../models/recipe");
const { User } = require("../models/user");
const controlWrapper = require("../decorators/controllWrapper");
const { HttpError } = require("../helpers");

const controllerGetFavorites = async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  const FavoriteRecipes = await Recipe.findById(user.favorites[0]);
  console.log(FavoriteRecipes);
  res.status(200).json({ favorites: user.favorites });
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
    throw HttpError(400, "Recipe is already added to favorites");
  }

  await User.findByIdAndUpdate(
    id,
    { $push: { favorites: recipeId } },
    { new: true }
  );

  await Recipe.findByIdAndUpdate(
    recipeId,
    { $push: { favorites: id } },
    { new: true }
  );

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

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw HttpError(404, "Recipe not found");
  }

  await User.findByIdAndUpdate(
    id,
    { $pull: { favorites: recipeId } },
    { new: true }
  );

  await Recipe.findByIdAndUpdate(
    recipeId,
    { $pull: { favorites: id } },
    { new: true }
  );

  res.status(201).json({
    message: `Recipe id=${recipeId} deleted from favorites successfully`,
  });
};

module.exports = {
  controllerGetFavorites: controlWrapper(controllerGetFavorites),
  controllerAddToFavorites: controlWrapper(controllerAddToFavorites),
  controllerDeleteFromFavorites: controlWrapper(controllerDeleteFromFavorites),
};
