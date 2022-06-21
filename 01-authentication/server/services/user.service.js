const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

class UserService {
  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Promise<User>}
   */
  async createUser(userBody) {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    return User.create(userBody);
  }

  async queryUsers(filter, options) {
    const users = await User.paginate(filter, options);
    return users;
  }
}

module.exports = new UserService();
