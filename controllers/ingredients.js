const Ingredient = require("../models/ingredient");
const controlWrapper = require("../decorators/controllWrapper");
const { Recipe } = require("../models/recipe");

const controllerIngredientsList = async (req, res) => {
  const ingredientsList = await Ingredient.find();

  res.status(200).json(ingredientsList);
};

const controllerSearchByIngredients = async (req, res) => {
  const { ingredient } = req.query;
  
  const ingredientSearch = await Ingredient.findOne({name: { $regex: ingredient, $options: 'i' } });
  if (!ingredientSearch) {
    return res.status(404).json({ message: "Not found ingredients" });
  }

  const id = ingredientSearch._id.toString()

const result = await Recipe.find({
  ingredients: {
    $elemMatch: {
      id: id,
    },
  },
});

res.json(result);
};

module.exports = {
  controllerIngredientsList: controlWrapper(controllerIngredientsList),
  controllerSearchByIngredients: controlWrapper(controllerSearchByIngredients),
};
