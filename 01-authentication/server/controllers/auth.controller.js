const httpStatus = require("http-status");
const { authService, userService, tokenService } = require("../services");
const EmailService = require("../services/email.service");

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
    // Log out users
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  }

  async refreshTokens(req, res) {
    // Refresh new tokens
    const tokens = await tokenService.refreshAuth(req.body.refreshToken);
    res.send(tokens);
  }

  async forgotPassword(req, res) {
    // Get token for resetting password
    const { user, resetPasswordToken } =
      await tokenService.generateResetPasswordToken(req.body.email);
    console.log(resetPasswordToken);
    // Send the mail for resetting password
    await new EmailService(user).sendPasswordResetToken(resetPasswordToken);

    res.status(httpStatus.NO_CONTENT).send();
  }

  async resetPassword(req, res) {
    await authService.resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  }

  async sendVerificationEmail(req, res) {
    // Get token for resetting password
    const { user, sendVerificationToken } =
      await tokenService.generateVerifyEmailToken(req.body.email);

    // Send the mail for resetting password
    await new EmailService(user).sendVerificationEmail(sendVerificationToken);

    res.status(httpStatus.NO_CONTENT).send();
  }

  async verifyEmail(req, res) {
    await authService.verifyEmail(req.params.token);

    res.status(httpStatus.NO_CONTENT).send();
  }
}

module.exports = new AuthController();
