const HttpError = require("../helpers/HttpError");
const {joiSchemas} = require("../models/recipe");


const validateAddRecipe = async (req, res, next) => {

}
const validateRecipeUpdate = async (req, res, next) => {

}

const validateRecipeFavoriteUpdate = async (req, res, next) =>{

}
const validateArr = async (req, res, next) =>{
      const {categoriesName} = req.params; 
      if(check(categoriesName).not().isEmpty() && categoriesName !== undefined) {
        throw HttpError(404, "Don't exsist the file")
    }
    else {
    next();
    }
}
module.exports = {
    validateAddRecipe,
    validateRecipeUpdate,
    validateRecipeFavoriteUpdate,
    validateArr
}