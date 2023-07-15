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

const controllerGetRecipesByCategory = async (req, res) => {
  let category = req.params.categoryName;
  category = category.charAt(0).toUpperCase() + category.slice(1);

  const { page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const totalRecipes = await Recipe.countDocuments({ category });
    const recipes = await Recipe.find({ category }).skip(skip).limit(limit);
    const totalPages = Math.ceil(totalRecipes / limit);

    res.json({
      recipes,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const controllerGetRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw HttpError(404, "Not found");
  }
  res.json(recipe);
};

const controllerGetPopularRecipes = async (req, res) => {

}
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

const controllerSearchByTitle = async (req, res) => {
  const { title } = req.query;


  if (title === "") {
    throw new HttpError(400, `Empty search fild`);
  }
const searchRecipe = await Recipe.find({
    title: { $regex: title, $options: "i" },
  });

  if (searchRecipe.length === 0) {
    throw HttpError(404, "recipe not found");
  }
  return res.json(searchRecipe);
};



module.exports = {
  controllerCategoryList: controlWrapper(controllerCategoryList),
  controllerMainPage: controlWrapper(controllerMainPage),
  controllerGetRecipesByCategory: controlWrapper(controllerGetRecipesByCategory),
  controllerGetRecipeById: controlWrapper(controllerGetRecipeById),
  controllerAddRecipe: controlWrapper(controllerAddRecipe),
  controllerRemoveRecipe: controlWrapper(controllerRemoveRecipe),
  controllerUpdateRecipe: controlWrapper(controllerUpdateRecipe),
  controllerUpdateStatusRecipe: controlWrapper(controllerUpdateStatusRecipe),
  controllerSearchByTitle: controlWrapper(controllerSearchByTitle),

};
