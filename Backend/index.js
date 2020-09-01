const express = require("express");
const cors = require("cors");
const mongoose = require("./db.js");

//Routers
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
const MobileInformationRouter = require("./routes/MobileInformationRoutes");
const MobileInformationDetailRouter = require("./routes/MobileInformationDetailRoutes");
const citiesRouter = require("./routes/CitiesRoutes");
const ethiopiaDataRouter = require("./routes/EthiopiaDataRoutes");
const SymptomUserHistoryRouter = require("./routes/SymptomUserHistoryRoutes");
const UpdatesRouter = require("./routes/UpdateRoutes");
const LocalPolicyRouter = require("./routes/LocalPolicyRoutes");
const DistrictRouter = require("./routes/DistrictRoutes");
const SymptomStatisticsRouter = require("./routes/SymptomStatisticsRoutes");
const WebResourceRouter = require("./routes/WebRoutes");
const CitizenSymptomRouter = require("./routes/CitizenSymptomRoutes");
const NewCitizenSymptomRouter = require("./routes/NewCitizenSymptomRoutes");
const TestReportRouter = require("./routes/TestReportRoutes");
const CaseInvestigationRouter = require("./routes/CaseInvestigationRoutes");
const InterviewRouter = require("./routes/InterviewRoutes");

const logger = require("./middlewares/logger");
const bodyParser = require("body-parser");
const compression = require("compression");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(logger.requestLog);
app.use(compression({ filter: shouldCompress }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(publicResourceRouter);

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
app.use(MobileInformationDetailRouter);
app.use(MobileInformationRouter);
app.use(citiesRouter);
app.use(ethiopiaDataRouter);
app.use(SymptomUserHistoryRouter);
app.use(UpdatesRouter);
app.use(LocalPolicyRouter);
app.use(DistrictRouter);
app.use(SymptomStatisticsRouter);
app.use(WebResourceRouter);
app.use(CitizenSymptomRouter);
app.use(NewCitizenSymptomRouter);
app.use(TestReportRouter);
app.use(CaseInvestigationRouter);
app.use(InterviewRouter);

app.use(express.static("public"));
app.use("/img", express.static(__dirname + "/img"));

app.listen(port, () => {
  console.log("Server is running... at port " + port);
});

function shouldCompress(req, res) {
  let routeToCompress = [
    "/api/resources/information",
    "/api/resources/learning-path",
    "/api/resources/statistics-description",
  ];
  if (req.route == null || !routeToCompress.includes(req.route.path)) {
    // " not compressed"
    return false;
  }

  // "compressed"
  return compression.filter(req, res);
}

module.exports = app;
