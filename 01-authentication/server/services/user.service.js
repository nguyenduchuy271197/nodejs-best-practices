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

  /**
   * Create a user
   * @param {Object} filter
   * @param {Object} options
   * @returns {Promise<User>}
   */
  async queryUsers(filter, options) {
    const users = await User.paginate(filter, options);
    return users;
  }

  /**
   * Create a user
   * @param {string} userId
   * @returns {Promise<User>}
   */
  getUserById(userId) {
    return User.findById(userId);
  }

  /**
   * Update a user
   * @param {string} userId
   * @param {Object} userBody
   * @returns {Promise<User>}
   */
  async updateUserById(userId, updateBody) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    if (updateBody.email && (await User.isEmailTaken(updateBody.email))) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    Object.assign(user, updateBody);
    await user.save();

    return user;
  }

  /**
   * Delete a user
   * @param {string} userId
   * @returns
   */
  async deleteUserById(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await user.remove();
  }
}

module.exports = new UserService();
