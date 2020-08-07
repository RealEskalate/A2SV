var express = require("express");
var router = express.Router();
var StatisticsController = require("../controllers/StatisticsController");

// router.post("/api/statistics", StatisticsController.get_statistics);
router.get("/api/statistics", StatisticsController.get_statistics);
router.get("/api/statistics/countries", StatisticsController.get_country_slugs);
router.get("/api/statistics/world", StatisticsController.getWorldStats);

module.exports = router;