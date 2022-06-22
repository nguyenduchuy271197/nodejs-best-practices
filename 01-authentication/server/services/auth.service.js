const httpStatus = require("http-status");
const { User, Token } = require("../models");
const ApiError = require("../utils/ApiError");
const tokenService = require("./token.service");
const userService = require("./user.service");

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

  /**
   * Refresh token
   * @param {string} refreshToken
   * @returns {Object}
   */
  async refreshAuth(refreshToken) {
    try {
      const refreshTokenDoc = tokenService.verifyToken(refreshToken, "REFRESH");
      const user = await userService.getUserById(refreshTokenDoc.user);

      if (!user) throw new Error();

      await refreshTokenDoc.remove();

      return tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please Authenticate");
    }
  }

  /**
   * Reset password
   * @param {string} refreshToken
   * @returns {Object}
   */
  async resetPassword(resetPasswordToken, newPassword) {
    try {
      const resetPasswordTokenDoc = tokenService.verifyToken(
        resetPasswordToken,
        "RESET_PASSWORD"
      );

      const user = await userService.getUserById(resetPasswordTokenDoc.user);

      if (!user) throw new Error();

      await userService.updateUserById(resetPasswordTokenDoc.user, {
        password: newPassword,
      });

      await Token.deleteMany({ user: user.id, type: "RESET_PASSWORD" });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
    }
  }
}

module.exports = new AuthService();
