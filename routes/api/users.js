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
const {validateRegister, validateLogin, validateSubscription, validateEmailVerification} = require("../../middlewares/userValidation");
const authentication = require("../../middlewares/authentication");
const upload = require("../../middlewares/upload");

const router = express.Router();

// register

router.post("/register", upload.single('avatar'), validateRegister, controllerRegister);
// email verify
router.get("/verify/:verificationToken", controllerVerifyEmail);
router.get("/categories/:categoryName", CategoriesPage);
// resend email verification
router.post("/verify", validateEmailVerification, controllerResendVerifyEmail);


// login
router.post("/login", validateLogin, controllerLogin);
// logout
router.post("/logout", authentication, controllerLogout);
// current info
router.get("/current", authentication, controllerGetCurrent);
// subscription
router.patch("/", authentication, validateSubscription, controllerUpdateSubscription);
// avatar
router.patch("/avatars", authentication, upload.single('avatar'), controllerUpdateAvatar);


module.exports = router;
