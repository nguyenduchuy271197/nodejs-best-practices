const userService = require("../services/user.service");
const pick = require("../utils/pick");

class UserController {
  async getUsers(req, res) {
    const filter = pick(req.query, ["name", "role"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await userService.queryUsers(filter, options);
    res.send(result);
  }

  async getUser(req, res) {
    const user = await userService.getUserById(req.params.userId);
    res.send(user);
  }
}

module.exports = new UserController();
