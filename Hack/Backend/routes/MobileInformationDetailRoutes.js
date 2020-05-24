var express = require("express");
var router = express.Router();
var MobileInformationDetailController = require("../controllers/MobileInformationDetailController");

router.get("/api/resources/mobile/information-detail", MobileInformationDetailController.get_mobile_info);
router.get("/api/resources/mobile/information-detail/:id", MobileInformationDetailController.get_info_by_id)
router.post("/api/resources/mobile/information-detail", MobileInformationDetailController.post_info);
router.patch("/api/resources/mobile/information-detail", MobileInformationDetailController.change_info);
router.delete("/api/resources/mobile/information-detail", MobileInformationDetailController.delete_info);

module.exports = router;