const express = require("express");
const mongoose = require("./db.js");
const locationRouter = require("./routes/LocationRoutes.js");

const symptomRouter = require("./routes/SymptomRoutes.js");
const symptomuserRouter = require("./routes/SymptomUserRoutes.js");

const userRouter = require("./routes/UserRoutes.js");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(locationRouter);
app.use(userRouter);
app.use(symptomRouter);
app.use(symptomuserRouter);

app.listen(3000, () => {
  console.log("Server is running...");
});
