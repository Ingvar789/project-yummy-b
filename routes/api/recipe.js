const express = require("express");
const authentication = require("../../middlewares/authentication");
const isValidId = require("../../middlewares/isValidId");
const upload = require("../../middlewares/upload");
const {
  validateAddRecipe,
  validateRecipeUpdate,
  validateRecipeFavoriteUpdate,
} = require("../../middlewares/recipeValidation");

const {
  controllerCategoryList,
  controllerMainPage,
  controllerGetRecipesByCategory,
  controllerGetRecipeById,
  controllerAddRecipe,
  controllerRemoveRecipe,
  controllerUpdateRecipe,
  controllerGetPopularRecipes,
  controllerUpdateStatusRecipe,
  controllerSearchByTitle,
} = require("../../controllers/recipe");

const router = express.Router();

router.use(authentication);

// get categories
router.get("/category-list", controllerCategoryList);
// recipes by categories for main page
router.get("/main-page", controllerMainPage);
// search recipes by keyword
router.get("/search", controllerSearchByTitle);
// recipes by category, 8 recipe per page
router.get("/category/:categoryName", controllerGetRecipesByCategory);
// get one recipe by id
router.get("/:recipeId", isValidId, controllerGetRecipeById);


// popular recipes
// router.get("/popular-recipe", controllerGetPopularRecipes);

router.post("/own-recipes", upload.single("preview"), controllerAddRecipe);

router.delete("/own-recipes/:recipeId", isValidId, controllerRemoveRecipe);

router.put(
  "/:recipeId",
  isValidId,
  validateRecipeUpdate,
  controllerUpdateRecipe
);

module.exports = router;
