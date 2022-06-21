const moment = require("moment");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { Token } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

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
      "ACCESS"
    );

    // Generate refresh token with 15-min expiration
    const refreshTokenExpires = moment().add(15, "minutes");
    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      "REFRESH"
    );

    await this.saveToken(refreshToken, user.id, refreshTokenExpires, "REFRESH");

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
   * @param {Object} user
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
}

module.exports = new TokenService();
