const router = require("express").Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const { userValidation } = require("../validations");

router
  .route("/")
  .get(
    auth("getUsers"),
    validate(userValidation.getUsers),
    userController.getUsers
  )
  .post();

module.exports = router;
