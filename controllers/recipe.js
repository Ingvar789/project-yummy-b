const {FoodItem} = require("../models/recipe")
// const HttpError = require("../helpers/HttpError");
// const { Recipe} = require("../models/recipe");
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

const kindOfRecipe  = async (req, res) => {
//const categories = await FoodItem.findOne({categories})
    res.status(201).json({categories:categories});
}


module.exports = {
<<<<<<< HEAD
    controllerListRecipe: controlWrapper(controllerListRecipe),
    controllerGetRecipeById: controlWrapper(controllerGetRecipeById),
    controllerAddRecipe: controlWrapper(controllerAddRecipe),
    controllerRemoveRecipe: controlWrapper(controllerRemoveRecipe),
    controllerUpdateRecipe: controlWrapper(controllerUpdateRecipe),
    controllerUpdateStatusRecipe: controlWrapper(controllerUpdateStatusRecipe),
    getCategoriesRecepe: controlWrapper(kindOfRecipe),
}
=======
  controllerCategoryList: controlWrapper(controllerCategoryList),
  controllerListRecipe: controlWrapper(controllerListRecipe),
  controllerGetRecipeById: controlWrapper(controllerGetRecipeById),
  controllerAddRecipe: controlWrapper(controllerAddRecipe),
  controllerRemoveRecipe: controlWrapper(controllerRemoveRecipe),
  controllerUpdateRecipe: controlWrapper(controllerUpdateRecipe),
  controllerUpdateStatusRecipe: controlWrapper(controllerUpdateStatusRecipe),
};
>>>>>>> c810f35bf215a608024512d7983721204920e86e
