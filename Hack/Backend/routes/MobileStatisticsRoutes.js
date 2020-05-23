var express = require("express");
var router = express.Router();
var MobileStatisticsController = require("../controllers/MobileStatisticsController");

router.get("/api/resources/mobile", MobileStatisticsController.get_mobile_info);
router.get("/api/resources/mobile/:id", MobileStatisticsController.get_info_by_id)
router.post("/api/resources/mobile", MobileStatisticsController.post_info);
router.patch("/api/resources/mobile", MobileStatisticsController.change_info);
router.delete("/api/resources/mobile", MobileStatisticsController.delete_info);

module.exports = router;