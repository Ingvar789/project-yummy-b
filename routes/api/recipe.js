const express = require("express");
// const authentication = require("../../middlewares/authentication");
const isValidId = require("../../middlewares/isValidId");
const {joiSchemas} = require("../../models/recipe");
const {
  validateAddRecipe,
  validateRecipeUpdate,
  validateRecipeFavoriteUpdate
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
<<<<<<< HEAD
  kindOfRecipe
=======
  controllerSearchByTitle,
  controllerSearchByIngredients,
>>>>>>> f22e8da2131541e10281ceaaf87cd24c1486b89a
} = require("../../controllers/recipe");


const router = express.Router();

// router.use(authentication);

router.get("/category-list", controllerCategoryList);

router.get("/search", controllerSearchByTitle);

router.get("/ingredients", controllerSearchByIngredients);

router.get("/main-page", controllerMainPage);

router.get("/", controllerListRecipe);

router.get("/:recipeId", isValidId, controllerGetRecipeById);

router.post("/", validateAddRecipe, controllerAddRecipe);

router.delete("/:recipeId", isValidId, controllerRemoveRecipe);

router.put(
  "/:recipeId",
  isValidId,
  validateRecipeUpdate,
  controllerUpdateRecipe
);

<<<<<<< HEAD
router.patch('/:recipeId/favorite', isValidId, validateRecipeFavoriteUpdate, controllerUpdateStatusRecipe)
=======
router.patch(
  "/:recipeId/favorite",
  isValidId,
  validateRecipeFavoriteUpdate,
  controllerUpdateStatusRecipe
);
>>>>>>> f22e8da2131541e10281ceaaf87cd24c1486b89a

module.exports = router;
