const HttpError = require("../helpers/HttpError");
const { joiSchemas } = require("../models/recipe");

const validateAddRecipe = (req, res, next) => {
  try {
    const validationResult = joiSchemas.recipeSchemaJoi.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      throw HttpError(400, validationResult.error.message);
    }
    next();
  } catch (e) {
    next(e);
  }
};
module.exports = {
  validateAddRecipe,
  validateRecipeUpdate,
  validateRecipeFavoriteUpdate,
};
