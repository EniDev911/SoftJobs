const express = require("express");
const routesUsers = require("./routes/users.routes");
const cors = require("cors");
const logger = require("morgan");
const app = express();

app.use(express.json());
app.use(cors())
app.use(logger("dev"));

app.use(routesUsers);

module.exports = app;