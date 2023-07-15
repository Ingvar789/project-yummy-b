const express = require("express");
const { controllerIngredientsList, controllerSearchByIngredients } = require("../../controllers/ingredients");

const authentication = require("../../middlewares/authentication");

const router = express.Router();

//router.use(authentication);

router.get("/list", authentication, controllerIngredientsList);
router.get("/search", controllerSearchByIngredients);

module.exports = router;
