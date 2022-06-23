require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const db = require("./config/db");
const routes = require("./routes");
const { errorHandler, errorConverter } = require("./middlewares/error");
const helmet = require("helmet");
const compression = require("compression");
const { authLimiter } = require("./middlewares/rateLimiter");
const config = require("./config/config");
const morgan = require("./config/morgan");

const app = express();
const port = 3000;

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// Middlewares
app.use(cors());
app.options("*", cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// Routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
