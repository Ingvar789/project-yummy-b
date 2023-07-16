const HttpError = require("../helpers/HttpError");
const { Recipe } = require("../models/recipe");
const controlWrapper = require("../decorators/controllWrapper");
const { cloudinary } = require("../helpers");
const Jimp = require("jimp");
const fs = require("fs").promises;

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
  const popularRecipes = await Recipe.find().sort("-favoritesCounter");

  const popularRecipeInfo = popularRecipes.map((recipe) => {
    return {
      id: recipe._id,
      title: recipe.title,
      favoritesCounter: recipe.favoritesCounter,
    };
  });

  res.status(200).json(popularRecipeInfo);
};

const controllerAddRecipe = async (req, res) => {
  const { _id: owner } = req.user;

  let preview;

  if (req.file) {
    const { path: oldPath } = req.file;
    await Jimp.read(oldPath)
      .then((image) => {
        return image.resize(250, 250).write(oldPath);
      })
      .catch((e) => {
        throw HttpError(400, "Bad request");
      });

    const fileData = await cloudinary.uploader.upload(oldPath, {
      folder: "images",
    });
    await fs.unlink(oldPath);

    preview = fileData.url;
  } else {
    preview =
      "https://res.cloudinary.com/dvmiapyqk/image/upload/v1688894039/1_jyhhh3.png";
  }

  console.log(preview);
  const newRecipe = await Recipe.create({ ...req.body, preview, owner });
  res.status(201).json(newRecipe);
};

const controllerRemoveRecipe = async (req, res) => {
  const { recipeId } = req.params;

  const deleteRecipe = await Recipe.findOneAndRemove({ _id: recipeId });
  if (!deleteRecipe) {
    throw new HttpError(404, `Recipe with id ${recipeId} not found`);
  }
  return res.status(200).json({ message: "Recipe has deleted" });
};

const controllerGetRecipeByUserId = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Recipe.find({owner});
  if (!result) {
      throw new HttpError(404, `Recipe not found`)
    }
    res.status(200).json(result);
};

const controllerUpdateStatusRecipe = async (req, res) => {
  res.json(req.body);
};

const controllerSearchByTitle = async (req, res) => {
  const { title } = req.query;

  if (title === "") {
    throw new HttpError(400, `Empty search field`);
  }
  const searchRecipe = await Recipe.find({
    title: { $regex: title, $options: "i" },
  });
  console.log(searchRecipe);
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
  controllerGetRecipeByUserId: controlWrapper(controllerGetRecipeByUserId),
  controllerUpdateStatusRecipe: controlWrapper(controllerUpdateStatusRecipe),
  controllerSearchByTitle: controlWrapper(controllerSearchByTitle),
  controllerGetPopularRecipes: controlWrapper(controllerGetPopularRecipes),
};
