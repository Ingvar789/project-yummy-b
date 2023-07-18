const express = require("express");
const {
  controllerGetFavorites,
  controllerAddToFavorites,
  controllerDeleteFromFavorites,
} = require("../../controllers/favorites");

const authentication = require("../../middlewares/authentication");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.use(authentication);

router.get("/", controllerGetFavorites);
router.patch("/:id", isValidId, controllerAddToFavorites);
router.delete("/:id", isValidId, controllerDeleteFromFavorites);

module.exports = router;
