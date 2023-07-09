const HttpError = require("../helpers/HttpError");

const validate = schema => {
    const func = (req, res, next) => {
        if (Object.keys(req.body).length === 0){
            throw HttpError(400, "missing fields");
        }

        const validationResult = schema.validate(req.body, { abortEarly: false });
        if (validationResult.error){
            throw HttpError(400,validationResult.error.message);
        }
        next();
    }
    return func
}

module.exports = {
    validate,
}