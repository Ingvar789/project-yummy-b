const Ingredient = require("../models/ingredient");
const controlWrapper = require("../decorators/controllWrapper");

const controllerIngredientsList = async (req, res) => {
  const ingredientsList = await Ingredient.find();

  res.status(200).json(ingredientsList);
};

module.exports = {
  controllerIngredientsList: controlWrapper(controllerIngredientsList),
};
