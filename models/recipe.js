const {Schema, model} = require("mongoose");
const {handleMongooseError} = require("../helpers");
const Joi = require("joi");

const recipeSchemaJoi = Joi.object({
  name: Joi.string().required().messages({'any.required':`missing required name field`}),
  favorite: Joi.boolean(),
})

const updateFavoriteSchemaJoi = Joi.object({
  favorite: Joi.boolean().required(),
})

const joiSchemas = {
  recipeSchemaJoi,
  updateFavoriteSchemaJoi,
}
const recipeSchemaMongoose = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for recipe'],
  }
}, {versionKey: false, timestamps: true});

const Recipe = model("contact", recipeSchemaMongoose);

recipeSchemaMongoose.post("save", handleMongooseError);

module.exports = {
  Recipe,
  joiSchemas,
}
