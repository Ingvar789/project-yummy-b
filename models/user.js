const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegex = /^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/m;

const userSchemaRegisterJoi = Joi.object({
  name: Joi.string(),
  email: Joi.string()
    .pattern(emailRegex)
    .required()
    .messages({ "any.required": `missing required email field` }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": `missing required password field` }),
  subscription: Joi.boolean(),
});

const userSchemaLoginJoi = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .required()
    .messages({ "any.required": `missing required email field` }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": `missing required password field` }),
});

const userSchemaSubscriptionJoi = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .required()
    .messages({ "any.required": `missing required email field` }),
});

const userEmailVerificationJoi = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .required()
    .messages({ "any.required": `missing required email field` }),
});
const userManageJoi = Joi.object({
  name: Joi.string(),
  avatarURL: Joi.string(),
});
const joiAuthSchemas = {
  userSchemaRegisterJoi,
  userSchemaLoginJoi,
  userSchemaSubscriptionJoi,
  userEmailVerificationJoi,
  userManageJoi,
};

const userSchemaMongoose = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      match: emailRegex,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    avatarURL: {
      type: String,
    },
    subscription: {
      type: String,
      match: emailRegex,
      default: "",
    },
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    shoppingList: {
      _id: false,
      type: [
        {
          id: {
            type: String,
            ref: "ingredient",
          },
          recipeId: {
            type: String,
            ref: "recipe",
          },
          measure: {
            type: [String],
            default: [],
          },
        },
      ],
      default: [],
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

userSchemaMongoose.post("save", handleMongooseError);

const User = model("user", userSchemaMongoose);

module.exports = {
  joiAuthSchemas,
  User,
};
