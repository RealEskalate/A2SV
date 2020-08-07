var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

const medicalhistory_controller = require("../controllers/MedicalHistoryController.js");

// router.get("/api/medicalhistory/", verifyToken.verifyToken, medicalhistory_controller.get_all_medicalhistory);
router.get("/api/medicalhistory/:id", verifyToken.verifyToken, medicalhistory_controller.get_medicalhistory_by_id);
router.get("/api/medicalhistory/name/:name", verifyToken.verifyToken, medicalhistory_controller.get_medicalhistory_by_name);

router.post("/api/medicalhistory", verifyToken.verifyToken, medicalhistory_controller.post_medicalhistory);
router.patch("/api/medicalhistory/:id", verifyToken.verifyToken, medicalhistory_controller.update_medicalhistory);
router.delete("/api/medicalhistory/", verifyToken.verifyToken, medicalhistory_controller.delete_medicalhistory);

module.exports = router;
