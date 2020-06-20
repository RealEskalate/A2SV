var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var symptomuser_history_controller = require("../controllers/SymptomUserHistoryController");

router.get(
  "/api/symptomuserhistory/user/:user_id",
  verifyToken.verifyToken,
  symptomuser_history_controller.get_symptomuser_history_by_user_id
);
router.delete(
  "/api/symptomuserhistory/user/:user_id",
  verifyToken.verifyToken,
  symptomuser_history_controller.delete_symptomuser_history_by_user_id
);

module.exports = router;
