const express = require("express");
const {
    controllerRegister,
    controllerLogin,
    controllerGetCurrent,
    controllerLogout,
    controllerUpdateSubscription,
    controllerUpdateAvatar,
    controllerVerifyEmail,
    controllerResendVerifyEmail
        } = require("../../controllers/users");

const authentication = require("../../middlewares/authentication");
const upload = require("../../middlewares/upload");
const {validate} = require("../../middlewares/userValidation");
const {joiAuthSchemas} = require("../../models/user");

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
router.patch("/", authentication, validate(joiAuthSchemas.userSchemaSubscriptionJoi), controllerUpdateSubscription);
// avatar
router.patch("/avatars", authentication, upload.single('avatar'), controllerUpdateAvatar);
// email verify
router.get("/verify/:verificationToken", controllerVerifyEmail);
// resend email verification
router.post("/verify", validate(joiAuthSchemas.userEmailVerificationJoi), controllerResendVerifyEmail);




module.exports = router;
