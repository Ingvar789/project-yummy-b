const { isValidObjectId } = require("mongoose");
const HttpError = require("../helpers/HttpError");

const isValidIdParam = (paramName) => (req, res, next) => {
  const paramValue = req.params[paramName];
  console.log(paramValue, paramName)
  if (!isValidObjectId(paramValue)) {
    return next(HttpError(400, `${paramValue} is not a valid ${paramName}`));
  }
  next();
};

module.exports = isValidIdParam;
