const express = require("express");
const {
  controllerGetFavorites,
  controllerAddToFavorites,
  controllerDeleteFromFavorites,
} = require("../../controllers/favorites");

const authentication = require("../../middlewares/authentication");
const isValidIdParam = require("../../middlewares/isValidIdParam");

const router = express.Router();

router.use(authentication);

router.get("/", controllerGetFavorites);
router.patch(
  "/:recipeId",
  isValidIdParam("recipeId"),
  controllerAddToFavorites
);
router.delete(
  "/:recipeId",
  isValidIdParam("recipeId"),
  controllerDeleteFromFavorites
);

module.exports = router;
