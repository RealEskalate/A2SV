var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");
const grant_access = require("../middlewares/auth.js").grant_access;

// Require controller modules.
var user_controller = require("../controllers/UserController.js");


router.get("/api/users", verifyToken.verifyToken, user_controller.get_all_users);
router.get("/api/users-detail/:id", verifyToken.verifyToken, user_controller.get_detail_info);
router.get("/api/users-stat", verifyToken.verifyToken, user_controller.get_role_stat);

router.get("/api/users/:id", verifyToken.verifyToken, user_controller.get_user_by_id);
router.post("/api/auth/login", user_controller.get_user_by_credentials);
router.post("/api/auth/register", user_controller.post_user);
router.patch("/api/users", verifyToken.verifyToken, user_controller.update_user);
router.delete("/api/users", verifyToken.verifyToken, user_controller.delete_user);


// invited users route.  
router.post("/api/user/invite", verifyToken.verifyToken,grant_access('create', 'invite_user'),user_controller.send_invitation_link);
router.post("/api/user/invite-multiple", verifyToken.verifyToken,grant_access('create', 'invite_user'),user_controller.send_multiple_invitation_link);
router.post("/api/user/create-invited-user",user_controller.create_invited_user);
// reset password.
router.post("/api/user/reset-password",user_controller.send_reset_link);
router.post("/api/user/change-password",user_controller.save_new_password);

module.exports = router;
