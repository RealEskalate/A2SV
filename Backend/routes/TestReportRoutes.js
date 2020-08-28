var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");
const grant_access = require("../middlewares/auth.js").grant_access;

// Require controller modules.
var test_report_controller = require("../controllers/TestReportController.js");

router.get("/api/test-report", verifyToken.verifyToken, test_report_controller.get_all_test_reports);
router.post("/api/test-report", verifyToken.verifyToken, test_report_controller.post_test_report);
router.patch("/api/test-report", verifyToken.verifyToken, test_report_controller.update_test_report);
router.delete("/api/test-report/:id", verifyToken.verifyToken, test_report_controller.delete_symptom);

module.exports = router;