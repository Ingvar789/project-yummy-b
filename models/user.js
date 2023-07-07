const {Schema, model} = require("mongoose");
const {handleMongooseError} = require("../helpers");
const Joi = require("joi");

const emailRegex = /^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/m;
const subscriptions = ['starter', 'pro', 'business'];

const userSchemaRegisterJoi = Joi.object({
    name: Joi.string(),
    email: Joi.string().pattern(emailRegex).required().messages({'any.required':`missing required email field`}),
    password: Joi.string().min(6).required().messages({'any.required':`missing required password field`}),
    subscription: Joi.string()
})

const userSchemaLoginJoi = Joi.object({
    email: Joi.string().pattern(emailRegex).required().messages({'any.required':`missing required email field`}),
    password: Joi.string().min(6).required().messages({'any.required':`missing required password field`}),
})

const userSchemaSubscriptionJoi = Joi.object({
    subscription: Joi.string().valid(...subscriptions).required().messages({'any.required':`subscription must be one of ${subscriptions} `}),
})

const userEmailVerificationJoi = Joi.object({
    email: Joi.string().pattern(emailRegex).required().messages({'any.required':`missing required email field`}),
})
const joiAuthSchemas = {
    userSchemaRegisterJoi,
    userSchemaLoginJoi,
    userSchemaSubscriptionJoi,
    userEmailVerificationJoi
}

const userSchemaMongoose = new Schema({
    name: {
        type:String,
    },
    email: {
        type: String,
        match: emailRegex,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, 'Set password for user'],
    },
    avatarURL: {
        type: String,
    },
    subscription: {
        type: String,
        enum: subscriptions,
        default: "starter"
    },
    token: String,
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },
}, {versionKey: false, timestamps: true});

userSchemaMongoose.post("save", handleMongooseError);

const User = model("user", userSchemaMongoose);
module.exports = {
    joiAuthSchemas,
    User,
}
