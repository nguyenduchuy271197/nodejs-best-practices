const userService = require("../services/user.service");
const pick = require("../utils/pick");

class UserController {
  async getUsers(req, res) {
    const filter = pick(req.query, ["name", "role"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = userService.queryUsers(filter, options);
    res.send(result);
  }
}

module.exports = new UserController();
