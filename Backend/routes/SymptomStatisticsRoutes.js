var express = require("express");
var router = express.Router();
var symptomStatisticsController = require('../controllers/SymptomStatisticsController');

router.get("/api/symptom_statistics", symptomStatisticsController.get_symptom_number);
router.get("/api/symptom_statistics/people", symptomStatisticsController.get_people_with_symptoms);
router.get("/api/symptom_statistics/most_common", symptomStatisticsController.get_most_common);
router.get("/api/symptom_statistics/logs", symptomStatisticsController.get_symptom_logs);
router.get("/api/symptom_statistics/logs/user/:user_id", symptomStatisticsController.get_logs_by_user_id);

module.exports = router;
