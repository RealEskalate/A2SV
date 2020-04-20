var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

const medicalhistory_user_controller = require("../controllers/MedicalHistoryUserController.js");

router.get("/api/medicalhistoryuser/", medicalhistory_user_controller.get_all_medicalhistory_user);
router.get("/api/medicalhistoryuser/user/:user_id", medicalhistory_user_controller.get_medicalhistory_user_by_user_id);
router.get("/api/medicalhistoryuser/medicalhistory/:medicalhistory_id", medicalhistory_user_controller.get_medicalhistory_user_by_medicalhistory_id);

router.post("/api/medicalhistoryuser/", medicalhistory_user_controller.post_medicalhistory_user);
router.patch("/api/medicalhistoryuser/", medicalhistory_user_controller.update_medicalhistory_user);
router.delete("/api/medicalhistoryuser", medicalhistory_user_controller.delete_medicalhistory_user);

module.exports = router;
