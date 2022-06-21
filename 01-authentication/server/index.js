require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const routes = require("./routes");
const { errorHandler, errorConverter } = require("./middlewares/error");

const app = express();
const port = 3000;

// Intialize database
db.init();

app.use(cors());
app.use(express.json());

app.use("/v1/auth", routes.authRoute);

app.use(errorConverter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
