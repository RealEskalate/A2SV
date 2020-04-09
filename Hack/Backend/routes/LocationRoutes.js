var express = require("express");
var router = express.Router();

// Require controller modules.
var location_controller = require("../controllers/LocationController.js");

router.get("/api/locations", location_controller.get_all_locations);
router.get("/api/locations/:id", location_controller.get_location_by_id);
router.get(
  "/api/locations/:longitude/:latitude",
  location_controller.get_location_by_coordinates
);
router.post("/api/locations", location_controller.post_location);
router.patch("/api/locations", location_controller.update_location);
router.delete("/api/locations", location_controller.delete_location);

module.exports = router;
