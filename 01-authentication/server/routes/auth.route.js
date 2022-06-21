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
router.post("/logout", authController.logout);

module.exports = router;
