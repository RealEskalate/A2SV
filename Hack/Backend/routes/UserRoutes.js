var express = require("express");
var router = express.Router();

// Require controller modules.
var user_controller = require("../controllers/UserController.js");

router.get("/api/users", user_controller.get_all_users);
router.get("/api/users/:id", user_controller.get_user_by_id);
router.post("/api/auth/login", user_controller.get_user_by_credentials);
router.post("/api/auth/register", user_controller.post_user);
router.patch("/api/users", user_controller.update_user);
router.delete("/api/users", user_controller.delete_user);

module.exports = router;
