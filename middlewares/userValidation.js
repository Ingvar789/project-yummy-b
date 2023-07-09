const HttpError = require("../helpers/HttpError");
const controlWrapper = require("../decorators/controllWrapper");

const validate = schema => {
    const func = (req, res) => {
        if (Object.keys(req.body).length === 0){
            throw HttpError(400, "missing fields");
        }

        const validationResult = schema.validate(req.body, { abortEarly: false });
        if (validationResult.error){
            throw HttpError(400,validationResult.error.message);
        }
        console.log(schema);
    }
    return func
}

module.exports = {
    validate: controlWrapper(validate),
}