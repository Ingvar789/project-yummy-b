const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const recipeSchemaJoi = Joi.object({
    title: Joi.string().required().messages({ "any.required": `missing required title field` }),
    category: Joi.string().required().messages({ "any.required": `missing required category field` }),
    area: Joi.string(),
    instructions: Joi.array(),
    description: Joi.string(),
    thumb: Joi.string(),
    preview: Joi.string(),
    time: Joi.string().required().messages({ "any.required": `missing required time field` }),
    youtube: Joi.string(),
    tags: Joi.array(),
    ingredients: Joi.array().required().messages({ "any.required": `missing required ingredients field` }),
});

const joiSchemas = {
  recipeSchemaJoi,
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
    thumb: {
      type: String,
    },
    preview: {
      type: String,
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
                  type: String
              }
          }
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
