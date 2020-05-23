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
const statisticsResourceRouter = require("./routes/StatisticsResourcesRoute.js");
const informationRouter = require("./routes/InformationRoute.js");
const learningPathRouter = require("./routes/LearningPathRoute.js");
const MobileStatisticsRouter = require("./routes/MobileStatisticsRoutes");

const logger = require('./middlewares/logger');
const bodyParser = require("body-parser");
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(logger.requestLog);
app.use(compression({ filter: shouldCompress }))

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
app.use(statisticsResourceRouter);
app.use(informationRouter);
app.use(learningPathRouter);
app.use(MobileStatisticsRouter);
app.use(express.static('public'));
app.use('/img', express.static(__dirname + '/img'));

app.listen(port, () => {
    console.log("Server is running... at port " + port);
});



function shouldCompress (req, res) {
    let routeToCompress=["/api/resources/information", "/api/resources/learning-path", "/api/resources/statistics-description" ];
    if (!(routeToCompress.includes(req.route.path) )){
       // " not compressed"
       return false
    }
    
    // "compressed"
    return compression.filter(req, res)
}

module.exports = app;