const express = require("express");
const authentication = require("../../middlewares/authentication");
const isValidId = require("../../middlewares/isValidId");
const upload = require("../../middlewares/upload");
const {
  validateAddRecipe,
} = require("../../middlewares/recipeValidation");

const {
  controllerCategoryList,
  controllerMainPage,
  controllerGetRecipesByCategory,
  controllerGetRecipeById,
  controllerAddRecipe,
  controllerRemoveRecipe,
  controllerGetRecipeByUserId,
  controllerGetPopularRecipes,
  controllerSearchByTitle,
} = require("../../controllers/recipes");

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
router.get("/:id", isValidId, controllerGetRecipeById);
// get recipes by user id
router.get("/own-recipes/:id", isValidId, controllerGetRecipeByUserId);
// popular recipes
router.get("/popular-recipe", controllerGetPopularRecipes);
// add recipe
router.post("/own-recipes", upload.single("preview"), controllerAddRecipe);
// delete recipe by id
router.delete("/own-recipes/:id", isValidId, controllerRemoveRecipe);
// popular recipes
router.get("/popular-recipe", controllerGetPopularRecipes);


module.exports = router;
