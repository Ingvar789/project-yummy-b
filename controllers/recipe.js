const HttpError = require("../helpers/HttpError");
const { Recipe} = require("../models/recipe");
const controlWrapper = require("../decorators/controllWrapper");
const { string } = require("joi");

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

const controllerListRecipe = async (req, res) => {
  res.json(req.body);
};

const controllerGetRecipeById = async (req, res) => {
  res.json(req.body);
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

const controllerSearchByTitle = async(req,res) => {
  const {title}  = req.body;
  const titleSearch = title.trim();
  if (titleSearch === '') {
      throw new HttpError(400, `Empty search fild`);
    }
    const result = {title: { $regex: title, $options: 'i' } }
  const searchRecipe = await Recipe.find({title: { $regex: title, $options: 'i' } });

  if (searchRecipe.length === 0) {
    throw HttpError(404, "recipe not found");
  }
  return res.json(searchRecipe);

}

const controllerSearchByIngredients = async (req, res) => {
  const {id}  = req.body;
  console.log(req.body)
  if (id === "") {
    return res.status(404).json({ message: "Not found ingredients" });
  }
  const result = await Recipe.find({
    ingredients: {
      $elemMatch: {
        id: id,
      },
    },
  });

  return res.json(result);
};

module.exports = {
  controllerCategoryList: controlWrapper(controllerCategoryList),
  controllerListRecipe: controlWrapper(controllerListRecipe),
  controllerGetRecipeById: controlWrapper(controllerGetRecipeById),
  controllerAddRecipe: controlWrapper(controllerAddRecipe),
  controllerRemoveRecipe: controlWrapper(controllerRemoveRecipe),
  controllerUpdateRecipe: controlWrapper(controllerUpdateRecipe),
  controllerUpdateStatusRecipe: controlWrapper(controllerUpdateStatusRecipe),
  controllerSearchByTitle: controlWrapper(controllerSearchByTitle),
  controllerSearchByIngredients: controlWrapper(controllerSearchByIngredients),
};
