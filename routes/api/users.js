const express = require("express");
const authentication = require("../../middlewares/authentication");
const upload = require("../../middlewares/upload");
const { validate } = require("../../middlewares/userValidation");
const { joiAuthSchemas } = require("../../models/user");
const {
  controllerRegister,
  controllerLogin,
  controllerGetCurrent,
  controllerLogout,
  controllerUpdateSubscription,
  controllerUpdateUser,
  controllerVerifyEmail,
  controllerResendVerifyEmail,
} = require("../../controllers/users");


const router = express.Router();

// register
router.post("/register", upload.single("avatar"), validate(joiAuthSchemas.userSchemaRegisterJoi), controllerRegister);
// login
router.post("/login", validate(joiAuthSchemas.userSchemaLoginJoi), controllerLogin);
// logout
router.post("/logout", authentication, controllerLogout);
// current info
router.get("/current", authentication, controllerGetCurrent);
// subscription
router.patch("/subscribe", authentication, validate(joiAuthSchemas.userSchemaSubscriptionJoi), controllerUpdateSubscription);
// manage data-user
router.patch("/update-user", authentication, upload.single("avatar"), controllerUpdateUser);
// email verify
router.get("/verify/:verificationToken", controllerVerifyEmail);
// resend email verification
router.post("/verify", validate(joiAuthSchemas.userEmailVerificationJoi), controllerResendVerifyEmail);

module.exports = router;
