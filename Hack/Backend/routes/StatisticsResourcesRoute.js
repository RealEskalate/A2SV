var express = require("express");
var router = express.Router();
var StatisticsResourceController = require("../controllers/StatisticsResourceController");

router.get("/api/resources/statistics-description", StatisticsResourceController.getStatisticsResourceByFields);
router.get("/api/resources/statistics-description/id", StatisticsResourceController.getStatisticsResourceById);
router.post("/api/resources/statistics-description", StatisticsResourceController.postStatisticsResource);
router.patch("/api/resources/statistics-description", StatisticsResourceController.updateStatisticsResource);
router.delete("/api/resources/statistics-description", StatisticsResourceController.deleteStatisticsResource);
module.exports = router;