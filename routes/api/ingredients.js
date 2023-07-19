const express = require("express");
const {
  controllerIngredientsList,
  controllerSearchByIngredients,
} = require("../../controllers/ingredients");

const authentication = require("../../middlewares/authentication");

const router = express.Router();

router.use(authentication);
// get list of ingredients
router.get("/list", controllerIngredientsList);
// search recipes by ingredient
router.get("/search", controllerSearchByIngredients);

module.exports = router;
