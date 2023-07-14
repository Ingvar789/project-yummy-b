const express = require("express");
// const authentication = require("../../middlewares/authentication");
const isValidId = require("../../middlewares/isValidId");
// const {joiSchemas} = require("../../models/recipe");
const {
  validateAddRecipe,
  validateRecipeUpdate,
  validateRecipeFavoriteUpdate
 } = require("../../middlewares/recipeValidation");

const {
  controllerCategoryList,
  controllerMainPage,
  controllerGetRecipesByCategory,
  controllerGetRecipeById,
  controllerAddRecipe,
  controllerRemoveRecipe,
  controllerUpdateRecipe,
  controllerUpdateStatusRecipe,
  kindOfRecipe,
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
router.get("/category/:categoryName", controllerGetRecipesByCategory);
// get one recipe by id
router.get("/:recipeId", isValidId, controllerGetRecipeById);
// search recipes by keyword
router.get("/search", controllerSearchByTitle);
// get one recipe by id
router.get("/:recipeId", isValidId, controllerGetRecipeById);


router.post("/", validateAddRecipe, controllerAddRecipe);

router.delete("/:recipeId", isValidId, controllerRemoveRecipe);

router.put("/:recipeId", isValidId, validateRecipeUpdate, controllerUpdateRecipe);

router.patch('/:recipeId/favorite', isValidId, validateRecipeFavoriteUpdate, controllerUpdateStatusRecipe)


router.patch("/:recipeId/favorite", isValidId, validateRecipeFavoriteUpdate, controllerUpdateStatusRecipe);

module.exports = router;
