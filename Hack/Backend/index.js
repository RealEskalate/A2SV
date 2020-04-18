const express = require("express");
const cors = require('cors');
const mongoose = require("./db.js");
const locationRouter = require("./routes/LocationRoutes.js");
const locationUserRouter = require("./routes/LocationUserRoutes");
const medicalhistoryRouter = require("./routes/MedicalHistoryRoutes.js");
const medicalhistoryuserRouter = require("./routes/MedicalHistoryUserRoutes.js");

const symptomRouter = require("./routes/SymptomRoutes.js");
const symptomuserRouter = require("./routes/SymptomUserRoutes.js");

const newsRouter = require("./routes/NewsRoutes.js");
const logRouter = require("./routes/LogRoutes");
const userRouter = require("./routes/UserRoutes.js");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
<<<<<<< HEAD
app.use(cors());

const logger = require('./middlewares/logger');
app.use(logger.requestLog);
=======
>>>>>>> 7893848... [backend] Change the way to set Port

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(locationRouter);
app.use(userRouter);
app.use(symptomRouter);
app.use(symptomuserRouter);
app.use(locationUserRouter);
app.use(newsRouter);
app.use(logRouter);

app.listen(port, () => {
  console.log("Server is running...");
});
