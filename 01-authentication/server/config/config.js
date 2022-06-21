module.exports = {
  jwt: {
    secret: "mysecret",
  },
  db: {
      name: "test",
      uri: process.env.DB_URI
  }
};
