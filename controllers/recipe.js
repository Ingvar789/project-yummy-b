// const HttpError = require("../helpers/HttpError");
// const { Recipe} = require("../models/recipe");
const controlWrapper = require("../decorators/controllWrapper");

const controllerListRecipe = async (req, res) => {

    res.json(req.body);
}

const controllerGetRecipeById = async (req, res) => {

    res.json(req.body);
}

const controllerAddRecipe = async (req, res) => {

        res.status(201).json(req.body);
}

const controllerRemoveRecipe = async (req, res) => {

        res.json({
            message: "contact deleted"
        });
}
const controllerUpdateRecipe = async (req, res) => {

        res.json(req.body);

}

const controllerUpdateStatusRecipe  = async (req, res) => {

        res.json(req.body);
}

module.exports = {
    controllerListRecipe: controlWrapper(controllerListRecipe),
    controllerGetRecipeById: controlWrapper(controllerGetRecipeById),
    controllerAddRecipe: controlWrapper(controllerAddRecipe),
    controllerRemoveRecipe: controlWrapper(controllerRemoveRecipe),
    controllerUpdateRecipe: controlWrapper(controllerUpdateRecipe),
    controllerUpdateStatusRecipe: controlWrapper(controllerUpdateStatusRecipe),
}