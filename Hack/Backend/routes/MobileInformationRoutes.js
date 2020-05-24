var express = require("express");
var router = express.Router();
var MobileInformationController = require("../controllers/MobileInformationController");

router.get("/api/resources/mobile/information", MobileInformationController.get_mobile_info);
router.get("/api/resources/mobile/information/:id", MobileInformationController.get_info_by_id)
router.post("/api/resources/mobile/information", MobileInformationController.post_info);
router.patch("/api/resources/mobile/information", MobileInformationController.change_info);
router.delete("/api/resources/mobile/information", MobileInformationController.delete_info);

module.exports = router;