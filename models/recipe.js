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
const getCategoriesJoi = Joi.object({
  categories: Joi.array().items(
      Joi.object({
        beef: Joi.array().required(),
        breakfast: Joi.array().required(),
        chiken: Joi.array().required(),
        desserts: Joi.array().required(),
        goat: Joi.array().required(),
        lamb: Joi.array().required(),
        miscellaneous: Joi.array().required(),
        pasta: Joi.array().required(),
        pork: Joi.array().required(),
        seafood: Joi.array().required(),
        side: Joi.array().required(),
      })
  ).required(),
})
const joiSchemas = {
  recipeSchemaJoi,
  updateFavoriteSchemaJoi,
  getCategoriesJoi,
}
const recipeSchemaMongoose = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for recipe'],
  }
}, {versionKey: false, timestamps: true});

const Recipe = model("contact", recipeSchemaMongoose);

recipeSchemaMongoose.post("save", handleMongooseError);
const categoriesMongooseShema = new Schema({
  beef: {
    type: Array,
    required: true,
  },
  breakfast: {
    type: Array,
    required: true,
  },
  chiken: {
    type: Array,
    required: true,
  },
  desserts: {
    type: Array,
    required: true,
  },
  goat: {
    type: Array,
    required: true,
  },
  lamb: {
    type: Array,
    required: true,
  },
  miscellaneous: {
    type: Array,
    required: true,
  },
  pasta: {
    type: Array,
    required: true,
  },
  pork: {
    type: Array,
    required: true,
  },
  seafood: {
    type: Array,
    required: true,
  },
  side: {
    type: Array,
    required: true,
  },
}, {versionKey: false, timestamps: true});

const FoodItem = model("foodCategory", categoriesMongooseShema);

module.exports = {
  Recipe,
  joiSchemas,
  FoodItem,
}
