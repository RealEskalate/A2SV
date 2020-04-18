var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var alert_controller = require("../controllers/AlertController");

router.get("/api/alerts/:id", alert_controller.get_alert_by_id);
router.post("/api/alerts",  alert_controller.post_alert); 

module.exports = router;
