const express = require("express");
const locationRouter = require("./routes/LocationRoutes.js");
const mongoose = require("./db.js");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(locationRouter);

app.listen(3000, () => {
  console.log("Server is running...");
});
