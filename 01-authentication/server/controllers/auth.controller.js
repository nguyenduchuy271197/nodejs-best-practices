const httpStatus = require("http-status");
const { authService, userService, tokenService } = require("../services");

class AuthController {
  async register(req, res, next) {
    // Register user
    const user = await userService.createUser(req.body);

    res.status(httpStatus.CREATED).send({ user });
  }

  async login(req, res) {
    // Login with email and password
    const user = await authService.loginUserWithEmailAndPassword(req.body);

    // Generate the access token
    const tokens = await tokenService.generateAuthTokens(user);

    res.send({ user, tokens });
  }

  async logout(req, res) {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  }

  async refreshTokens(req, res) {
    const tokens = await tokenService.refreshAuth(req.body.refreshToken);
    res.send(tokens);
  }
}

module.exports = new AuthController();
