const express = require('express')
const authentication = require("../../middlewares/authentication")
const isValidId = require("../../middlewares/isValidId");
const {joiSchemas} = require("../../models/recipe");
const {
  validateAddRecipe,
  validateRecipeUpdate,
  validateRecipeFavoriteUpdate,
  validateArr,
 } = require("../../middlewares/recipeValidation");

const {
  controllerListRecipe,
  controllerGetRecipeById,
  controllerAddRecipe,
  controllerRemoveRecipe,
  controllerUpdateRecipe,
  controllerUpdateStatusRecipe,
  kindOfRecipe
} = require("../../controllers/recipe");


const router = express.Router()

router.use(authentication);

router.get('/', controllerListRecipe);

router.get('/:recipeId', isValidId, controllerGetRecipeById);

router.post('/', validateAddRecipe, controllerAddRecipe );

router.delete('/:recipeId', isValidId, controllerRemoveRecipe)

router.put('/:recipeId', isValidId, validateRecipeUpdate, controllerUpdateRecipe);

router.patch('/:recipeId/favorite', isValidId, validateRecipeFavoriteUpdate, controllerUpdateStatusRecipe)

router.get('/:recipeId', isValidId, controllerGetRecipeById);

router.get("/categories/:categoryName", joiSchemas.getCategoriesJoi, validateArr, kindOfRecipe);

module.exports = router
