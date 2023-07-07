const express = require('express')
const authentication = require("../../middlewares/authentication")
const isValidId = require("../../middlewares/isValidId");
const {
  validateAddContact,
  validateContactUpdate,
  validateContactFavoriteUpdate
 } = require("../../middlewares/contactsValidation");

const {
  controllerListRecipe,
  controllerGetRecipeById,
  controllerAddRecipe,
  controllerRemoveRecipe,
  controllerUpdateRecipe,
  controllerUpdateStatusRecipe,
} = require("../../controllers/recipe");

const router = express.Router()

router.use(authentication);

router.get('/', controllerListRecipe);

router.get('/:contactId', isValidId, controllerGetRecipeById);

router.post('/', validateAddContact, controllerAddRecipe );

router.delete('/:contactId', isValidId, controllerRemoveRecipe)

router.put('/:contactId', isValidId, validateContactUpdate, controllerUpdateRecipe);

router.patch('/:contactId/favorite', isValidId, validateContactFavoriteUpdate, controllerUpdateStatusRecipe)

module.exports = router
