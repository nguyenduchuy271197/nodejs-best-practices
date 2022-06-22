require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const db = require("./config/db");
const routes = require("./routes");
const { errorHandler, errorConverter } = require("./middlewares/error");

const app = express();
const port = 3000;

// Intialize database
db.init();

// Middlewares
app.use(cors());
app.use(express.json());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// Routes
app.use("/v1/auth", routes.authRoute);
app.use("/v1/users", routes.userRoute);

// Error Handler
app.use(errorConverter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
