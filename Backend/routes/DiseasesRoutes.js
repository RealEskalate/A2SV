var express = require("express");
var router = express.Router();
// Require controller modules.
var diseases_controller = require("../controllers/DiseasesController");

router.get("/api/diseases/", diseases_controller.get_diseases);

module.exports = router;
