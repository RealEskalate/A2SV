var express = require("express");
var router = express.Router();
var citizenSymptomController = require("../controllers/CitizenSymptomController");

router.get(
    "/api/citizen_symptoms",
    citizenSymptomController.get_citizens_with_symptoms
);

module.exports = router;
