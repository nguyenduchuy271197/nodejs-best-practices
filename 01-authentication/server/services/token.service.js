const moment = require("moment");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { Token, User } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const tokenTypes = require("../config/tokens");

class TokenService {
  /**
   * Generate token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {string} [secret]
   * @returns {string}
   */
  generateToken(userId, expires, type, secret = config.jwt.secret) {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };

    return jwt.sign(payload, secret);
  }

  /**
   * Save refresh token
   * @param {string} token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {bool} [blacklisted]
   * @returns {Promise<Token>}
   */
  saveToken(token, userId, expires, type, blacklisted = false) {
    return Token.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
  }

  /**
   * Generate access and refresh tokens
   * @param {Object} user
   * @returns {Object}
   */
  async generateAuthTokens(user) {
    // Generate access token with 10-min expiration
    const accessTokenExpires = moment().add(10, "minutes");
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      tokenTypes.ACCESS
    );

    // Generate refresh token with 15-min expiration
    const refreshTokenExpires = moment().add(15, "minutes");
    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );

    await this.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  /**
   * Verify token
   * @param {String} token
   * @param {String} type
   * @returns {Object}
   */
  async verifyToken(token, type) {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({
      token,
      user: payload.sub,
      type,
      blacklisted: false,
    });

    if (!tokenDoc) throw new Error("Token not found");

    return tokenDoc;
  }

  async generateResetPasswordToken(email) {
    const user = await User.findOne({ email });
    if (!user)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "No users found with this email"
      );

    // Generate reset password token with 10-min expiration
    const resetPasswordTokenExpires = moment().add(10, "minutes");
    const resetPasswordToken = this.generateToken(
      user.id,
      resetPasswordTokenExpires,
      tokenTypes.RESET_PASSWORD
    );

    await this.saveToken(
      resetPasswordToken,
      user.id,
      resetPasswordTokenExpires,
      tokenTypes.RESET_PASSWORD
    );

    return {
      user,
      resetPasswordToken,
    };
  }

  async generateVerifyEmailToken(email) {
    const user = await User.findOne({ email });

    // Generate reset password token with 10-min expiration
    const verifyEmailTokenExpires = moment().add(10, "minutes");
    const verifyEmailToken = this.generateToken(
      user.id,
      verifyEmailTokenExpires,
      tokenTypes.VERIFY_EMAIL
    );

    await this.saveToken(
      verifyEmailToken,
      user.id,
      verifyEmailTokenExpires,
      tokenTypes.VERIFY_EMAIL
    );

    return { user, verifyEmailToken };
  }
}

module.exports = new TokenService();
