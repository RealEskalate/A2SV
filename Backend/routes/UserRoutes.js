var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");
const grant_access = require("../middlewares/auth.js").grant_access;

// Require controller modules.
var user_controller = require("../controllers/UserController.js");


// router.get("/api/users", verifyToken.verifyToken, user_controller.get_all_users);
router.get("/api/users/:id", verifyToken.verifyToken, user_controller.get_user_by_id);
router.post("/api/auth/login", user_controller.get_user_by_credentials);
router.post("/api/auth/register", user_controller.post_user);
router.patch("/api/users", verifyToken.verifyToken, user_controller.update_user);
router.delete("/api/users", verifyToken.verifyToken, user_controller.delete_user);


// invited users route  
router.post("/api/user/invite", verifyToken.verifyToken,grant_access('create', 'invite_user'),user_controller.send_invitation_link);
router.post("/api/user/create-invited-user",user_controller.create_invited_user);

module.exports = router;
