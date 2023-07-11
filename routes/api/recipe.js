const express = require("express");
const authentication = require("../../middlewares/authentication");
const isValidId = require("../../middlewares/isValidId");
const {
  validateAddRecipe,
  validateRecipeUpdate,
  validateRecipeFavoriteUpdate,
} = require("../../middlewares/recipeValidation");

const {
  controllerCategoryList,
  controllerListRecipe,
  controllerGetRecipeById,
  controllerAddRecipe,
  controllerRemoveRecipe,
  controllerUpdateRecipe,
  controllerUpdateStatusRecipe,
} = require("../../controllers/recipe");

const router = express.Router();

router.use(authentication);

router.get("/category-list", controllerCategoryList);

router.get("/", controllerListRecipe);

router.get("/:recipeId", isValidId, controllerGetRecipeById);

router.post("/", validateAddRecipe, controllerAddRecipe);

router.delete("/:recipeId", isValidId, controllerRemoveRecipe);

router.put("/:recipeId", isValidId, validateRecipeUpdate, controllerUpdateRecipe);

router.patch("/:recipeId/favorite", isValidId, validateRecipeFavoriteUpdate, controllerUpdateStatusRecipe);

module.exports = router;
