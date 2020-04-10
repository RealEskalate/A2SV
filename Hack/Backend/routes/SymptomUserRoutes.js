var express = require("express");
var router = express.Router();

// Require controller modules.
var symptomuser_controller = require("../controllers/SymptomUserController");

router.get("/api/symptomuser", symptomuser_controller.get_all_symptomusers);
router.get("/api/symptomuser/:symptom_id", symptomuser_controller.get_symptomuser_by_symptom_id);
router.get("/api/symptomuser/:user_id", symptomuser_controller.get_symptomuser_by_user_id);

router.post("/api/symptomuser", symptomuser_controller.post_symptomuser);
router.patch("/api/symptomuser", symptomuser_controller.update_symptomuser);
router.delete("/api/symptomuser", symptomuser_controller.delete_symptomuser);

module.exports = router;