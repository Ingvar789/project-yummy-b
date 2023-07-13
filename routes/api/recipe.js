const express = require("express");
// const authentication = require("../../middlewares/authentication");
const isValidId = require("../../middlewares/isValidId");
const {
  validateAddRecipe,
  validateRecipeUpdate,
  validateRecipeFavoriteUpdate,
} = require("../../middlewares/recipeValidation");

const {
  controllerCategoryList,
  controllerMainPage,
  controllerListRecipe,
  controllerGetRecipeById,
  controllerAddRecipe,
  controllerRemoveRecipe,
  controllerUpdateRecipe,
  controllerUpdateStatusRecipe,
  controllerSearchByTitle,
  controllerSearchByIngredients,
} = require("../../controllers/recipe");

const router = express.Router();

// router.use(authentication);

// get categories
router.get("/category-list", controllerCategoryList);
// recipes by categories for main page
router.get("/main-page", controllerMainPage);

// recipes by category, 8 recipe per page
// router.get("/", controllerListRecipe);

// get one recipe by id
router.get("/:recipeId", isValidId, controllerGetRecipeById);
// search recipes by keyword
router.get("/search", controllerSearchByTitle);
// search recipes by ingredient
router.get("/ingredients", controllerSearchByIngredients);

router.post("/", validateAddRecipe, controllerAddRecipe);

router.delete("/:recipeId", isValidId, controllerRemoveRecipe);

router.put("/:recipeId", isValidId, validateRecipeUpdate, controllerUpdateRecipe);

router.patch("/:recipeId/favorite", isValidId, validateRecipeFavoriteUpdate, controllerUpdateStatusRecipe);

module.exports = router;
