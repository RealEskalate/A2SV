var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var log_controller = require("../controllers/LogController");

router.get("/api/logs", verifyToken.verifyToken, log_controller.get_logs);
router.get("/api/logs/:id", verifyToken.verifyToken, log_controller.get_log_by_id);
// router.get("/api/logs/status/:statusCode", log_controller.get_logs_by_status_codes);
// router.get("/api/logs/url/:url", log_controller.get_logs_by_urls);

module.exports = router;
