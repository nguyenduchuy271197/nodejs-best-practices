const nodemailer = require("nodemailer");

class Email {
  constructor(user, url) {
    this.name = user.name;
    this.to = user.email;
  }

  #newTransport() {
    return nodemailer.createTransport({});
  }
}
