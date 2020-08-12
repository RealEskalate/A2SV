var express = require("express");
var router = express.Router();
var symptomStatisticsController = require('../controllers/SymptomStatisticsController');

router.get("/api/symptom_statistics", symptomStatisticsController.get_symptom_number);
router.get("/api/symptom_statistics/most_common", symptomStatisticsController.get_most_common);

module.exports = router;
