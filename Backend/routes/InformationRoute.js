var express = require("express");
var router = express.Router();
var informationController = require("../controllers/InformationController");

router.get("/api/resources/information", informationController.getAllInformations);
router.post("/api/resources/information", informationController.postInformations);
router.patch("/api/resources/information", informationController.updateInformation);
router.delete("/api/resources/information", informationController.deleteInformation);
module.exports = router;