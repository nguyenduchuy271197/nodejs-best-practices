const httpStatus = require("http-status");
const { User, Token } = require("../models");
const ApiError = require("../utils/ApiError");

class AuthService {
  /**
   * Login with username and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async loginUserWithEmailAndPassword({ email, password }) {
    // Get user by email
    const user = await User.findOne({ email });

    // Check password same?
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }
    return user;
  }

  /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise}
   */
  async logout(refreshToken) {
    const refreshTokenDoc = await Token.findOne({
      token: refreshToken,
      type: "REFRESH",
      blacklisted: false,
    });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
    }
    await refreshTokenDoc.remove();
  }
}

module.exports = new AuthService();
