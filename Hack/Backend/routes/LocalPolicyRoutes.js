var express = require("express");
var router = express.Router();
var LocalPolicyController = require("./../controllers/LocalPolicyController");

router.get("/api/localpolicy", LocalPolicyController.get_all_local_policies);
router.get("/api/localpolicy/:current_country", LocalPolicyController.get_country_policies);

router.post("/api/localpolicy", LocalPolicyController.post_local_policy);

module.exports = router;