const HttpError = require("../helpers/HttpError");
const { Recipe} = require("../models/recipe");
const controlWrapper = require("../decorators/controllWrapper");

const controllerListRecipe = async (req, res) => {

    res.json(contacts);
}

const controllerGetRecipeById = async (req, res) => {

        res.json(contact);
}

const controllerAddRecipe = async (req, res) => {

        res.status(201).json(contact);
}

const controllerRemoveRecipe = async (req, res) => {

        res.json({
            message: "contact deleted"
        });
}
const controllerUpdateRecipe = async (req, res) => {

        res.json(contact);

}

const controllerUpdateStatusRecipe  = async (req, res) => {

        res.json(contact);
}

module.exports = {
    controllerListRecipe: controlWrapper(controllerListRecipe),
    controllerGetRecipeById: controlWrapper(controllerGetRecipeById),
    controllerAddRecipe: controlWrapper(controllerAddRecipe),
    controllerRemoveRecipe: controlWrapper(controllerRemoveRecipe),
    controllerUpdateRecipe: controlWrapper(controllerUpdateRecipe),
    controllerUpdateStatusRecipe: controlWrapper(controllerUpdateStatusRecipe),
}