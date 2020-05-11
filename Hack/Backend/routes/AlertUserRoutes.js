var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var alert_user_controller = require("../controllers/AlertUserController");

// router.get("/api/alerts_user", verifyToken.verifyToken, alert_user_controller.get_alert_user);
router.get("/api/alerts_user/:id", verifyToken.verifyToken, alert_user_controller.get_alert_user_by_id);
router.get("/api/alerts_user/user/:user_id", verifyToken.verifyToken, alert_user_controller.get_alerts_by_user_id);
router.post("/api/alerts_user", verifyToken.verifyToken, alert_user_controller.post_alert_user);
router.patch("/api/alerts_user", verifyToken.verifyToken, alert_user_controller.patch_alert_user);
router.delete("/api/alerts_user", verifyToken.verifyToken, alert_user_controller.delete_alert_user);
module.exports = router;


