const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const recipeSchemaJoi = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": `missing required title field` }),
  category: Joi.string()
    .required()
    .messages({ "any.required": `missing required category field` }),
  ingredients: Joi.array()
    .required()
    .messages({ "any.required": `missing required ingredients field` }),
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
            ref: "ingredient",
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
const categoriesMongooseShema = new Schema(
  {
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
  },
  { versionKey: false, timestamps: true }
);

const FoodItem = model("foodCategory", categoriesMongooseShema);

module.exports = {
  Recipe,
  joiSchemas,

  FoodItem,
};
