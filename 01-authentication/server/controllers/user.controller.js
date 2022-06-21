const httpStatus = require("http-status");
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

  async createUser(req, res) {
    const user = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  }

  async updateUser(req, res) {
    console.log("A");
    const user = await userService.updateUserById(req.params.userId, req.body);
    res.send(user);
  }

  async deleteUser(req, res) {
    await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
  }
}

module.exports = new UserController();
