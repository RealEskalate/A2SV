var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");
// Require controller modules.
var symptom_controller = require("../controllers/SymptomController");

router.get("/api/symptoms", verifyToken.verifyToken, symptom_controller.get_all_symptoms);
router.get("/api/symptoms/:id", verifyToken.verifyToken, symptom_controller.get_symptom_by_id);

router.post("/api/symptoms", symptom_controller.post_symptom);
router.post("/api/symptoms_many", symptom_controller.symptom_many_add);
router.patch("/api/symptoms/:symptom_id", symptom_controller.update_symptom);
router.delete("/api/symptoms", symptom_controller.delete_symptom);

module.exports = router;
