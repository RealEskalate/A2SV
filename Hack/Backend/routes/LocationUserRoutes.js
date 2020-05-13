var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var location_user_controller = require("../controllers/LocationUserController.js");

// router.get("/api/user_locations",  location_user_controller.get_all_location_users);
router.get("/api/user_locations/:id", verifyToken.verifyToken, location_user_controller.get_location_user_by_id);
router.post("/api/locations_symptoms", verifyToken.verifyToken, location_user_controller.get_all_locations_with_symptoms);
router.get("/api/user_locations/user/:user_id", verifyToken.verifyToken, location_user_controller.get_by_user_id);

router.post("/api/user_locations",  location_user_controller.post_location_user);
router.post("/api/user_locations_many",  location_user_controller.location_users_many_add);
router.patch("/api/user_locations", location_user_controller.update_location_user);
router.delete("/api/user_locations",  location_user_controller.delete_location_user);

module.exports = router;