const express = require("express");
const authentication = require("../../middlewares/authentication");
const upload = require("../../middlewares/upload");
const {validate} = require("../../middlewares/userValidation");
const {validateEdit} = require("../../middlewares/validateEdit");
const {joiAuthSchemas} = require("../../models/user");
const {
    controllerRegister,
    controllerLogin,
    controllerGetCurrent,
    controllerLogout,
    controllerUpdateSubscription,
    controllerEditProfile,
    controllerVerifyEmail,
    controllerResendVerifyEmail
        } = require("../../controllers/users");



const router = express.Router();

// register
router.post("/register", upload.single('avatar'), validate(joiAuthSchemas.userSchemaRegisterJoi), controllerRegister);
// login
router.post("/login", validate(joiAuthSchemas.userSchemaLoginJoi), controllerLogin);
// logout
router.post("/logout", authentication, controllerLogout);
// current info
router.get("/current", authentication, controllerGetCurrent);
// subscription
router.patch("/subscribe", authentication, validate(joiAuthSchemas.userSchemaSubscriptionJoi), controllerUpdateSubscription);
// avatar
router.patch("/edit", authentication, upload.single('avatar'),  controllerEditProfile);
// email verify
router.get("/verify/:verificationToken",  controllerVerifyEmail);
// resend email verification
router.post("/verify", validate(joiAuthSchemas.userEmailVerificationJoi), controllerResendVerifyEmail);

module.exports = router;
