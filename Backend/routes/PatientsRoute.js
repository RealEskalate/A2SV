var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");
const grant_access = require("../middlewares/auth.js").grant_access;

// Require controller modules.
var patient_controller = require("../controllers/PatientsController.js");

router.get("/api/patients", verifyToken.verifyToken, patient_controller.get_all_patients);
router.get("/api/patients/:id", verifyToken.verifyToken, patient_controller.get_patient_by_id);
router.post("/api/patients", verifyToken.verifyToken, patient_controller.post_patient_data);
router.patch("/api/patients/:id", verifyToken.verifyToken, patient_controller.update_patient);
router.delete("/api/patients/:id", verifyToken.verifyToken, patient_controller.delete_patient);

module.exports = router;