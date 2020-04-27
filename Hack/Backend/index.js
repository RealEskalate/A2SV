const express = require("express");
const cors = require('cors');
const mongoose = require("./db.js");

//Routers
const alertRouter = require("./routes/AlertRoutes");
const alertUserRouter = require("./routes/AlertUserRoutes");
const locationRouter = require("./routes/LocationRoutes.js");
const locationUserRouter = require("./routes/LocationUserRoutes");
const logRouter = require("./routes/LogRoutes");
const medicalhistoryRouter = require("./routes/MedicalHistoryRoutes.js");
const medicalhistoryuserRouter = require("./routes/MedicalHistoryUserRoutes.js");
const newsRouter = require("./routes/NewsRoutes.js");
const symptomRouter = require("./routes/SymptomRoutes.js");
const symptomuserRouter = require("./routes/SymptomUserRoutes.js");
const userRouter = require("./routes/UserRoutes.js");


const logger = require('./middlewares/logger');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(logger.requestLog);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(alertRouter);
app.use(alertUserRouter);
app.use(locationRouter);
app.use(locationUserRouter);
app.use(logRouter);
app.use(medicalhistoryRouter);
app.use(medicalhistoryuserRouter);
app.use(newsRouter);
app.use(symptomRouter);
app.use(symptomuserRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log("Server is running...");
});

module.exports = app;