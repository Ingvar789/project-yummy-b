const mongoose = require("mongoose");
const { handleMongooseError } = require("../helpers");
const { Schema, model } = mongoose;

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name of ingredients"],
    },
    desc: {
      type: String,
      required: [true, "Set description of ingredients"],
    },
    img: {
      type: String,
      required: [true, "Set image of ingredient"],
    },
  },
  { versionKey: false, timestamps: true }
);

const Ingredient = model("ingredient", ingredientSchema);

ingredientSchema.post("save", handleMongooseError);

module.exports = Ingredient;
