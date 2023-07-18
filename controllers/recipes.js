const HttpError = require("../helpers/HttpError");
const { Recipe: Recipes } = require("../models/recipe");
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

  const allRecipe = await Recipes.find();

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
    const totalRecipes = await Recipes.countDocuments({ category });
    const recipes = await Recipes.find({ category }).skip(skip).limit(limit);
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
  const { id } = req.params;
  const recipe = await Recipes.findById(id).populate("ingredients.id");
  if (!recipe) {
    throw HttpError(404, "Not found");
  }

  res.json(recipe);
};

const controllerGetPopularRecipes = async (req, res) => {
  const popularRecipes = await Recipes.find().sort("-favoritesCounter");

  const popularRecipeInfo = popularRecipes.map((recipe) => {
    return {
      _id: recipe._id,
      title: recipe.title,
      favoritesCounter: recipe.favoritesCounter,
    };
  });

  res.status(200).json(popularRecipeInfo);
};

const controllerAddRecipe = async (req, res) => {
  const { _id: owner } = req.user;
console.log(owner);

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

  const newRecipe = await Recipes.create({...req.body, preview, owner });

  res.status(201).json(newRecipe);
};

const controllerRemoveRecipe = async (req, res) => {
  const { id } = req.params;

  const deleteRecipe = await Recipes.findOneAndRemove({ _id: id });
  if (!deleteRecipe) {
    throw new HttpError(404, `Recipe with id ${id} not found`);
  }
  return res.status(200).json({ message: "Recipes has deleted" });
};

const controllerGetRecipeByUserId = async (req, res) => {
  const { _id: owner } = req.user;
  const {page = 1,  limit = 4 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Recipes.find({owner}).skip(skip).limit(limit);
  if (!result) {
      throw new HttpError(404, `Recipe not found`)
    }

  const total = await Recipes.countDocuments({owner});

  const totalPages = Math.ceil(total / limit);
  res.status(200).json({ result, totalPages, currentPage: page });
};

const controllerSearchByTitle = async (req, res) => {
  const { title } = req.query;
  const {page = 1,  limit = 6 } = req.query;
  const skip = (page - 1) * limit;

  if (title === "") {
    throw new HttpError(400, `Empty search field`);
  }
  const searchRecipe = await Recipes.find({
    title: { $regex: title, $options: "i" },
  });
  const searchRecipeLimit = await Recipes.find({
    title: { $regex: title, $options: "i" },
  }).skip(skip).limit(limit);
  if (searchRecipe.length === 0) {
    throw HttpError(404, "recipe not found");
  }
  const total = searchRecipe.length;
  const totalPages = Math.ceil(total / limit);
  return res.json({searchRecipeLimit, currentPage: page, totalPages });
};

module.exports = {
  controllerCategoryList: controlWrapper(controllerCategoryList),
  controllerMainPage: controlWrapper(controllerMainPage),
  controllerGetRecipesByCategory: controlWrapper(controllerGetRecipesByCategory),
  controllerGetRecipeById: controlWrapper(controllerGetRecipeById),
  controllerAddRecipe: controlWrapper(controllerAddRecipe),
  controllerRemoveRecipe: controlWrapper(controllerRemoveRecipe),
  controllerGetRecipeByUserId: controlWrapper(controllerGetRecipeByUserId),
  controllerSearchByTitle: controlWrapper(controllerSearchByTitle),
  controllerGetPopularRecipes: controlWrapper(controllerGetPopularRecipes),
};
