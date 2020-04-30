var express = require("express");
var router = express.Router();
var StatisticsController = require("../controllers/StatisticsController");

// router.post("/api/statistics", StatisticsController.get_statistics);
router.get("/api/statistics", StatisticsController.get_statistics);

module.exports = router;
