const express = require("express");
const { controllerIngredientsList } = require("../../controllers/ingredients");

const authentication = require("../../middlewares/authentication");

const router = express.Router();

router.use(authentication);

router.get("/list", authentication, controllerIngredientsList);

module.exports = router;
