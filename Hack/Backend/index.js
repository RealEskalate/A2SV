process.env.NODE_ENV = 'development';

const express = require("express");
const cors = require('cors');
const mongoose = require("./db.js");

//Routers
const alertRouter = require("./routes/AlertRoutes");
const alertUserRouter = require("./routes/AlertUserRoutes");
const locationRouter = require("./routes/LocationRoutes.js");
const locationUserRouter = require("./routes/LocationUserRoutes");
const medicalhistoryRouter = require("./routes/MedicalHistoryRoutes.js");
const medicalhistoryuserRouter = require("./routes/MedicalHistoryUserRoutes.js");
const publicResourceRouter = require("./routes/PublicResourcesRoutes");
const symptomRouter = require("./routes/SymptomRoutes.js");
const symptomuserRouter = require("./routes/SymptomUserRoutes.js");
const mapRouter = require("./routes/MapDataRoutes");
const newsRouter = require("./routes/NewsRoutes.js");
const logRouter = require("./routes/LogRoutes");
const userRouter = require("./routes/UserRoutes.js");
const statisticsRouter = require("./routes/StatisticsRoutes");
const diseasesRouter = require("./routes/DiseasesRoutes");
const messageRouter = require("./routes/MessageRoutes.js");

const logger = require('./middlewares/logger');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(logger.requestLog);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(publicResourceRouter);

app.use(alertRouter);
app.use(alertUserRouter);
app.use(locationRouter);
app.use(locationUserRouter);
app.use(logRouter);
app.use(statisticsRouter);
app.use(mapRouter);
app.use(diseasesRouter);
app.use(medicalhistoryRouter);
app.use(medicalhistoryuserRouter);
app.use(newsRouter);
app.use(symptomRouter);
app.use(symptomuserRouter);
app.use(userRouter);
app.use(messageRouter);

app.listen(port, () => {
    console.log("Server is running... at port " + port);
});

module.exports = app;