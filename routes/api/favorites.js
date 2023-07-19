const express = require("express");
const {
  controllerGetAllFavorites,
  controllerGetFavorites,
  controllerAddToFavorites,
  controllerDeleteFromFavorites,
} = require("../../controllers/favorites");

const authentication = require("../../middlewares/authentication");
const isValidIdParam = require("../../middlewares/isValidIdParam");

const router = express.Router();

router.use(authentication);
// get all favorites
router.get("/all", controllerGetAllFavorites)
// get favorites
router.get("/", controllerGetFavorites);
// add favorites
router.patch("/:recipeId", isValidIdParam("recipeId"), controllerAddToFavorites);
// delete favorites
router.delete("/:recipeId", isValidIdParam("recipeId"), controllerDeleteFromFavorites);

module.exports = router;
