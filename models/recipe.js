const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const recipeSchemaJoi = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": `missing required name field` }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchemaJoi = Joi.object({
  favorite: Joi.boolean().required(),
});

const joiSchemas = {
  recipeSchemaJoi,
  updateFavoriteSchemaJoi,
};
const recipeSchemaMongoose = new Schema(
  {
 
    title: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    area: {
      type: String,
    },
    instructions: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    preview: {
      type: String,
      require: true,
    },
    time: {
      type: String,
      require: true,
    },
    youtube: {
      type: String,
    },
    tags: {
      type: Array,
    },
    ingredients: {
        _id: false,
        type: [
            {
                id: {
                    type: String,
                    ref: "ingredient"
                },
                measure: {
                    type: [String],
                    default: [],
                },
            },
        ],
      require: true,
    },
    favoritesCounter: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

const Recipe = model("recipes", recipeSchemaMongoose);

recipeSchemaMongoose.post("save", handleMongooseError);

module.exports = {
  Recipe,
  joiSchemas,
};
