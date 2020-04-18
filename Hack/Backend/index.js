const express = require("express");
const mongoose = require("./db.js");
const locationRouter = require("./routes/LocationRoutes.js");
const locationUserRouter = require("./routes/LocationUserRoutes");

const symptomRouter = require("./routes/SymptomRoutes.js");
const symptomuserRouter = require("./routes/SymptomUserRoutes.js");

const newsRouter = require("./routes/NewsRoutes.js");

const userRouter = require("./routes/UserRoutes.js");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(locationRouter);
app.use(userRouter);
app.use(symptomRouter);
app.use(symptomuserRouter);
app.use(locationUserRouter);
app.use(newsRouter);

app.listen(port, () => {
  console.log("Server is running...");
});
