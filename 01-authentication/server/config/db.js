const mongoose = require("mongoose");
const config = require("./config");

async function init() {
  try {
    await mongoose.connect(config.db.uri);
    console.log("Database connected!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { init };
