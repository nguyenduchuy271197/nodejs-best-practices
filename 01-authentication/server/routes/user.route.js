const router = require("express").Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");

router
  .route("/")
  .get(
    auth("getUsers"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(
    auth("getUsers"),
    validate(userValidation.getUser),
    userController.getUser
  );

module.exports = router;
