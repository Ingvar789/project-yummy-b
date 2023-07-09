const HttpError = require("../helpers/HttpError");
const {joiAuthSchemas} = require("../models/user");
const controlWrapper = require("../decorators/controllWrapper");

const validateRegister = async (req, res, next) => {

}

const validateLogin = async (req, res, next) => {

}

const validateSubscription = async (req, res, next) =>{

}

const validateEmailVerification = async (req, res, next) =>{

}

module.exports = {
    validateRegister,
    validateLogin,
    validateSubscription,
    validateEmailVerification
}