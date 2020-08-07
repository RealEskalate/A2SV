var express = require("express");
var router = express.Router();
var localPoliciesController = require("./../controllers/LocalPoliciesController");
const verifyToken = require("../middlewares/auth.js").verifyToken;
const grant_access = require("../middlewares/auth.js").grant_access;


router.get("/api/local_policy", localPoliciesController.get_local_policies);
router.get("/api/local_policy/user", verifyToken, localPoliciesController.get_local_policy_for_user)
router.get("/api/local_policy/:id", localPoliciesController.get_one_local_policy);
router.post("/api/local_policy", verifyToken, grant_access('create', 'local_policy'), localPoliciesController.post_local_policy);
router.patch("/api/local_policy", verifyToken, grant_access('updateAny', 'local_policy'), localPoliciesController.update_local_policy);
router.delete("/api/local_policy", verifyToken, grant_access('deleteAny', 'local_policy'), localPoliciesController.delete_local_policy);

module.exports = router;