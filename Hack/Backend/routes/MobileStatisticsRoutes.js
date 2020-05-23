var express = require("express");
var router = express.Router();
var MobileStatisticsController = require("../controllers/MobileStatisticsController");

router.get("/api/resources/mobile/statistics", MobileStatisticsController.get_mobile_info);
router.get("/api/resources/mobile/statistics/:id", MobileStatisticsController.get_info_by_id)
router.post("/api/resources/mobile/statistics", MobileStatisticsController.post_info);
router.patch("/api/resources/mobile/statistics", MobileStatisticsController.change_info);
router.delete("/api/resources/mobile/statistics", MobileStatisticsController.delete_info);

module.exports = router;