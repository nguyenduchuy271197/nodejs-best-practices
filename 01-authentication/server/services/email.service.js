const nodemailer = require("nodemailer");
const config = require("../config/config");
const { convert } = require("html-to-text");
const pug = require("pug");

class EmailService {
  constructor(user) {
    this.name = user.username;
    this.to = user.email;
    this.from = `Likelion ${config.email.EMAIL_FROM}`;
    this.token = "";
  }

  async testAccount() {
    return await nodemailer.createTestAccount();
  }

  async newTransport() {
    // const testAccount = await this.testAccount();

    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "jape6h5spo6klvwz@ethereal.email" || testAccount.user, // generated ethereal user
        pass: "kSfgck6WaGv77qXnQY" || testAccount.pass, // generated ethereal password
      },
    });
  }

  async send(template, subject) {
    // Generate HTML template based on the template string
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      name: this.name,
      subject,
      url: `${config.localhost}/v1/auth/reset-password?token=${this.token}`,
    });
    // Create mailOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: convert(html),
      html,
    };

    // Create new transporter
    const transporter = await this.newTransport();

    // Send email
    const info = await transporter.sendMail(mailOptions);
    // console.log(nodemailer.getTestMessageUrl(info));
  }

  async sendVerificationEmail(verifyToken) {
    this.token = verifyToken;
    await this.send("verificationCode", "Your account verification code");
  }

  async sendPasswordResetToken(resetToken) {
    this.token = resetToken;
    await this.send(
      "resetPassword",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}

module.exports = EmailService;
