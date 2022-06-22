const router = require("express").Router();
const validate = require("../middlewares/validate");
const { authController } = require("../controllers");
const { authValidation } = require("../validations");

router.post("/login", validate(authValidation.login), authController.login);
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/refresh-token",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);

router.post(
  "/send-verification-email",
  validate(authValidation.sendVerificationEmail),
  authController.sendVerificationEmail
);

router.post(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

module.exports = router;
