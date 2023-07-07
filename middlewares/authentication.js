const HttpError = require("../helpers/HttpError");
const {verify} = require("jsonwebtoken");
const {User} = require("../models/user");
const {SECRET_KEY} = process.env;

const authentication = async (req, res, next) => {
    try {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ")
    if(bearer !== "Bearer") {
        throw HttpError(401, "Not authorized");
    }
        const {id} = verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if(!user || !user.token || user.token !== token) {
            throw HttpError(401, "Not authorized");
        }
        req.user = user;
        next();
    }
    catch {
        next(HttpError(401, "Not authorized"));
    }
}
module.exports = authentication;
