module.exports = {
  jwt: {
    secret: "mysecret",
  },
  db: {
    name: "test",
    uri: process.env.DB_URI,
  },
  env: process.env.NODE_ENV || "development",
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
};
