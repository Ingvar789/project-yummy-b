const HttpError = require("../helpers/HttpError");
const { Recipe } = require("../models/recipe");
const controlWrapper = require("../decorators/controllWrapper");

const controllerCategoryList = async (req, res) => {
  const categories = [
    "Beef",
    "Breakfast",
    "Chicken",
    "Dessert",
    "Goat",
    "Lamb",
    "Miscellaneous",
    "Pasta",
    "Pork",
    "Seafood",
    "Side",
    "Starter",
    "Vegan",
    "Vegetarian",
  ];

  const sortedCategories = categories.sort();

  res.json(sortedCategories);
};

const controllerMainPage = async (req, res) => {
  const categories = ["Breakfast", "Miscellaneous", "Chicken", "Dessert"];

  const latestRecipes = {};

  const allRecipe = await Recipe.find();

  categories.forEach((category) => {
    const recipes = allRecipe
      .filter((recipe) => recipe.category === category)
      .slice(-4);
    latestRecipes[category] = recipes;
  });

  res.json(latestRecipes);
};

const controllerListRecipe = async (req, res) => {
  res.json(req.body);
};

const controllerGetRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw HttpError(404, "Not found");
  }
  res.json(recipe);
};

const controllerAddRecipe = async (req, res) => {
  res.status(201).json(req.body);
};

const controllerRemoveRecipe = async (req, res) => {
  res.json({
    message: "contact deleted",
  });
};
const controllerUpdateRecipe = async (req, res) => {
  res.json(req.body);
};

const controllerUpdateStatusRecipe = async (req, res) => {
  res.json(req.body);
};

module.exports = {
  controllerCategoryList: controlWrapper(controllerCategoryList),
  controllerMainPage: controlWrapper(controllerMainPage),
  controllerListRecipe: controlWrapper(controllerListRecipe),
  controllerGetRecipeById: controlWrapper(controllerGetRecipeById),
  controllerAddRecipe: controlWrapper(controllerAddRecipe),
  controllerRemoveRecipe: controlWrapper(controllerRemoveRecipe),
  controllerUpdateRecipe: controlWrapper(controllerUpdateRecipe),
  controllerUpdateStatusRecipe: controlWrapper(controllerUpdateStatusRecipe),
};
