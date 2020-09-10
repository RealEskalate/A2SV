var express = require("express");
var router = express.Router();
var newCitizenSymptomController = require("../controllers/NewCitizenSymptomController");

router.get(
    "/api/new_citizen_symptoms",
    newCitizenSymptomController.get_new_citizens_with_symptoms
);

router.get("/api/test-stat",newCitizenSymptomController.ephi_test_stats);
router.get("/api/symptoms-count",newCitizenSymptomController.symptoms_count_in_district);

module.exports = router;
