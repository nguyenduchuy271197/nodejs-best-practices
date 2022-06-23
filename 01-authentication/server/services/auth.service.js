const httpStatus = require("http-status");
const { User, Token } = require("../models");
const ApiError = require("../utils/ApiError");
const tokenService = require("./token.service");
const userService = require("./user.service");
const tokenTypes = require("../config/tokens");

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
      type: tokenTypes.REFRESH,
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
      const refreshTokenDoc = tokenService.verifyToken(
        refreshToken,
        tokenTypes.REFRESH
      );
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
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   * @returns {Object}
   */
  async resetPassword(resetPasswordToken, newPassword) {
    try {
      const resetPasswordTokenDoc = await tokenService.verifyToken(
        resetPasswordToken,
        tokenTypes.RESET_PASSWORD
      );
      console.log("RESET", resetPasswordTokenDoc);
      const user = await userService.getUserById(resetPasswordTokenDoc.user);
      console.log("USER", user);

      if (!user) throw new Error();

      await userService.updateUserById(resetPasswordTokenDoc.user, {
        password: newPassword,
      });

      await Token.deleteMany({
        user: user.id,
        type: tokenTypes.RESET_PASSWORD,
      });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
    }
  }

  /**
   * Verify email
   * @param {string} verifyEmailToken
   * @returns {Object}
   */
  async verifyEmail(verifyEmailToken) {
    try {
      const verifyEmailTokenDoc = tokenService.verifyToken(
        verifyEmailToken,
        tokenTypes.VERIFY_EMAIL
      );

      const user = await userService.getUserById(verifyEmailTokenDoc.user);

      if (!user) throw new Error();

      await userService.updateUserById(verifyEmailTokenDoc.user, {
        isEmailVerified: true,
      });

      await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
    }
  }
}

module.exports = new AuthService();
