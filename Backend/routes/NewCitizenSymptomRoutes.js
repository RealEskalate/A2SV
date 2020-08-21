var express = require("express");
var router = express.Router();
var newCitizenSymptomController = require("../controllers/NewCitizenSymptomController");

router.get(
    "/api/new_citizen_symptoms",
    newCitizenSymptomController.get_new_citizens_with_symptoms
);

module.exports = router;
