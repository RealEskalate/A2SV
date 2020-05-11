var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js")

// Require controller modules.
var symptomuser_controller = require("../controllers/SymptomUserController");

router.get("/api/symptomuser", verifyToken.verifyToken, symptomuser_controller.get_all_symptomusers);
router.get("/api/symptomuser/symptom/:symptom_id", verifyToken.verifyToken, symptomuser_controller.get_symptomuser_by_symptom_id);
router.get("/api/symptomuser/user/:user_id", verifyToken.verifyToken, symptomuser_controller.get_symptomuser_by_user_id);

router.post("/api/symptomuser", verifyToken.verifyToken, symptomuser_controller.post_symptomuser);
router.patch("/api/symptomuser", verifyToken.verifyToken, symptomuser_controller.update_symptomuser);
router.delete("/api/symptomuser", verifyToken.verifyToken, symptomuser_controller.delete_symptomuser);

module.exports = router;