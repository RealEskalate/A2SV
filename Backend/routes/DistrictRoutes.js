var express = require("express");
var router = express.Router();

var district_controller = require('../controllers/DistrictController')

router.get("/api/districts/:district", district_controller.getSymptomUsersByDistrict);

module.exports = router;
