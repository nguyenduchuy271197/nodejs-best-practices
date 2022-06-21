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

  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
    }
    return user;
  }
}

module.exports = new UserService();
