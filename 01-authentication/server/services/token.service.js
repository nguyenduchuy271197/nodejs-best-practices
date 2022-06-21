const moment = require("moment");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { Token } = require("../models");

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
   * Create a user
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
}

module.exports = new TokenService();
