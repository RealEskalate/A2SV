var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var location_user_controller = require("../controllers/LocationUserController.js");

router.get("/api/user_locations",  location_user_controller.get_all_location_users);
router.get("/api/user_locations/location/:location_id", location_user_controller.get_by_location_id);

router.get("/api/user_locations/user/:user_id", location_user_controller.get_by_user_id);

router.post("/api/user_locations",  location_user_controller.post_location_user);
router.patch("/api/user_locations", location_user_controller.update_location_user);
router.delete("/api/user_locations",  location_user_controller.delete_location_user);

module.exports = router;