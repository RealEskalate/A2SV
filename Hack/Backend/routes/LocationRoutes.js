var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var location_controller = require("../controllers/LocationController.js");

router.get("/api/locations", verifyToken.verifyToken, location_controller.get_all_locations);
router.post("/api/locations_symptoms", verifyToken.verifyToken, location_controller.get_all_locations_with_symptoms);
router.get("/api/locations/:id", verifyToken.verifyToken, location_controller.get_location_by_id);
router.get(
  "/api/locations/:longitude/:latitude", verifyToken.verifyToken,
  location_controller.get_location_by_coordinates
);
router.get("/api/locations_risk/:id", verifyToken.verifyToken, location_controller.get_location_risk_by_id)
router.post("/api/locations", verifyToken.verifyToken, location_controller.post_location);
router.patch("/api/locations", verifyToken.verifyToken, location_controller.update_location);
router.delete("/api/locations", verifyToken.verifyToken, location_controller.delete_location);

module.exports = router;
